import mysql.connector
import csv
import time
import os

max_attempts = 10
attempts = 0

myconn = None
while attempts < max_attempts:
  try:
    myconn = mysql.connector.connect(
      host = os.environ.get("DB_HOST", "localhost"),
      user = os.environ.get("DB_USER", "root"),
      password = os.environ.get("DB_PASSWORD", "DL9ca#)$!"),
      port = os.environ.get("DB_PORT", 3306)
    )
    break
  except mysql.connector.Error as err:
    print(f"Error: {err}")
    print("Retrying in 5 seconds...")
    time.sleep(5)
    attempts += 1

if myconn is not None:
  mycursor = myconn.cursor()

  def initDB(filename, database):
    mycursor.execute("CREATE DATABASE IF NOT EXISTS %s" % database)
    mycursor.execute("USE %s" % database)

    fd = open(filename, 'r')
    sqlFile = fd.read()
    fd.close()
    sqlCommands = sqlFile.split(';')

    for command in sqlCommands:
      try:
        if command.strip() != '':
          mycursor.execute(command)
      except IOError:
        print ("Command skipped: ", IOError)

  def initMedicineManufacturers(filename, database):
    mycursor.execute("use %s" % database)
    with open(filename, 'r') as csvfile:
      reader = csv.DictReader(csvfile)
      for row in reader:
        try:
          mycursor.execute("INSERT IGNORE INTO medicine_manufacturers (name) values (%s)", (row['manufacturer_name'], ))
        except IOError:
          print("Command skipped: ", IOError)

  def initMedicines(filename, database):
    mycursor.execute("use %s" % database)
    with open(filename, 'r') as csvfile:
      reader = csv.DictReader(csvfile)
      for row in reader:
        try:
          mycursor.execute("INSERT INTO medicines (name, manufacturer_id, salt_1_name, salt_2_name) SELECT %s, mm.manufacturer_id, %s, %s FROM medicine_manufacturers mm WHERE mm.name = %s", (row['name'], row['short_composition1'], row['short_composition2'], row['manufacturer_name']))
        except IOError:
          print("Command skipped: ", IOError)

  print("Setting up database...")
  database = os.environ.get("DB_DATABASE", "test_db")

  initDB("./sql/init_db.sql", database)
  initMedicineManufacturers("./csv/medicine_dataset.csv", database)
  initMedicines("./csv/medicine_dataset.csv", database)

  myconn.commit()
  print("Database Setup done.")
  myconn.close()
else:
  print("Can't connect to MySQL.")
