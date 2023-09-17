const { PDFDocument } = require("pdf-lib");
const { BlobServiceClient } = require("@azure/storage-blob");

const { updateIntoDB } = require("../../utils/database/updateIntoDB");

const getMergedPdf = async ({ files }) => {
  try {
    const pdfDoc = await PDFDocument.create();

    for (const file of files) {
      const { originalname, buffer } = file;
      let image;

      if (originalname.toLowerCase().endsWith(".png"))
        image = await pdfDoc.embedPng(buffer);
      else if (
        originalname.toLowerCase().endsWith(".jpg") ||
        originalname.toLowerCase().endsWith(".jpeg")
      )
        image = await pdfDoc.embedJpg(buffer);
      else throw "Not supported files.";

      const page = pdfDoc.addPage([image.width, image.height]),
        { width, height } = page.getSize();

      page.drawImage(image, {
        x: 0,
        y: 0,
        width,
        height,
      });
    }
    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
  } catch (error) {
    throw error;
  }
};

const uploadToAzureStorage = async ({ pdf, visit_id }) => {
  const blobServiceClient = BlobServiceClient.fromConnectionString(
      `${process.env.DOCWELL_REPORTS_STORAGE_CONNECTION_STRING}`
    ),
    containerClient = blobServiceClient.getContainerClient(
      `${process.env.DB_DATABASE.replace(/_/g, "-")}`
    );

  try {
    await containerClient.create();
    await containerClient.setAccessPolicy("container");
  } catch (error) {
    console.log(`Container already exists`);
  }

  const blockBlobClient = containerClient.getBlockBlobClient(`${visit_id}.pdf`),
    blobExists = await blockBlobClient.exists();

  try {
    if (blobExists) await blockBlobClient.delete();
    await blockBlobClient.upload(pdf, pdf.length);
    return blockBlobClient.url;
  } catch (error) {
    throw `Error uploading or deleting blob`;
  }
};

const uploadToStorage = async (req, res) => {
  try {
    const { visit_id } = req.params,
      { files } = req,
      pdf = await getMergedPdf({ files }),
      reportsUrl = await uploadToAzureStorage({ pdf, visit_id });
    response = await updateIntoDB({
      tableName: "visits",
      filters: { visit_id },
      dataToUpdate: { reports_url: reportsUrl },
    });

    console.log(reportsUrl);

    res
      .status(200)
      .json({ message: "Files uploaded successfully.", payload: reportsUrl });
  } catch (error) {
    res.status(500).json({ message: "Error uploading files.", payload: error });
  }
};
module.exports = { uploadToStorage };
