import psycopg2
import os

DB_HOST = "db.mzqvadodifhitcbrvojn.supabase.co"
DB_NAME = "postgres"
DB_USER = "postgres"
DB_PASS = "Jemc8534!!!"
DB_PORT = "5432"

SQL_FILE = "migration_fixes.sql"

def run_migration():
    try:
        print(f"Connecting to {DB_HOST}...")
        conn = psycopg2.connect(
            host=DB_HOST,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASS,
            port=DB_PORT
        )
        conn.autocommit = True
        cur = conn.cursor()
        
        print(f"Reading {SQL_FILE}...")
        with open(SQL_FILE, 'r') as f:
            sql = f.read()
            
        print("Executing SQL...")
        cur.execute(sql)
        
        print("✅ Migration executed successfully!")
        
        cur.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    run_migration()
