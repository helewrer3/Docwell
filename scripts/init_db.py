import mysql.connector
import csv
import time
import os
import bcrypt

max_attempts = 10
attempts = 0

myconn = None
while attempts < max_attempts:
  try:
    myconn = mysql.connector.connect(
      host = os.environ.get("DB_HOST"),
      user = os.environ.get("DB_USER"),
      password = os.environ.get("DB_PASSWORD"),
      port = os.environ.get("DB_PORT")
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
  
  def initFirstUser(database):
    mycursor.execute("use %s" % database)
    try:
      rounds = 10
      salt = bcrypt.hashpw(os.environ.get("DB_FIRST_USER").encode('utf-8'), bcrypt.gensalt(rounds)).decode('utf-8')
      hashed_password = bcrypt.hashpw((os.environ.get("DB_FIRST_PASSWORD") + salt).encode('utf-8'), bcrypt.gensalt(rounds)).decode('utf-8')
      mycursor.execute("INSERT INTO user_accounts (name, password, salt, is_admin, is_user) values (%s, %s, %s, %s, %s)", (os.environ.get("DB_FIRST_USER"), hashed_password, salt, 1, 1))
    except IOError:
      print("Command skipped: ", IOError)
      
  print("Setting up database...")
  database = os.environ.get("DB_DATABASE")

  initDB("./sql/init_db.sql", database)
  initMedicineManufacturers("./csv/medicine_dataset.csv", database)
  initMedicines("./csv/medicine_dataset.csv", database)
  initFirstUser(database)

  myconn.commit()
  print("Database Setup done.")
  myconn.close()
else:
  print("Can't connect to MySQL.")
