using Microsoft.Data.SqlClient;
using System.Data;
using System.Globalization;
using System.Text;
namespace backend.Data
{
    public class DataProviderTimer
    {


        public string m_ConnectionString = String.Empty;
        public SqlTransaction? m_sqlTransaction;
        public SqlConnection? m_sqlConnection;

        public DataProviderTimer()
        {
            m_ConnectionString = AppData.GetConnectionString();
        }



        public SqlCommand GetCommand(string sqlQuery, object connection)
        {
            return new SqlCommand(sqlQuery, (SqlConnection)connection);
        }

        public void AddCommandParameter(ref SqlCommand command, string Name1, int type, int Länge, string Name2)
        {
            command.Parameters.Add(Name1, (SqlDbType)type, Länge, Name2);
        }


        public void SetParameter<T>(ref SqlCommand command, string Name, T Value)
        {
            command.Parameters[Name].Value = Value;
        }

        public int GetVarCharType()
        {
            return (int)SqlDbType.NVarChar;
        }

        public int GetBooleanType()
        {
            return (int)SqlDbType.Bit;
        }

        public int GetIntegerType()
        {
            return (int)SqlDbType.Int;
        }

        public int GetSQLBool(bool bValue)
        {
            if (bValue == true)
                return 1;
            else
                return 0;
        }

        public void CheckSqlOpenConnection()
        {
            try
            {
                if (m_sqlConnection == null || m_sqlConnection.State == ConnectionState.Broken || m_sqlConnection.State == ConnectionState.Closed)
                    SqlOpenConnection();
            }
            catch (Exception ex)
            {
                throw;
            }

        }
        public async Task<SqlConnection> SqlOpenConnectionAsync()
        {
            try
            {

                // Create and open a connection
                m_sqlConnection = new SqlConnection(m_ConnectionString);
                await m_sqlConnection.OpenAsync();//.Open();

                return m_sqlConnection;
            }
            catch (Exception ex)
            {
                throw;
            }

        }
        public async Task<bool> SqlCloseConnectionAsync()
        {
            try
            {
                if (m_sqlConnection == null)
                    return true;
                await m_sqlConnection.CloseAsync();
                m_sqlConnection.Dispose();
                return true;
            }
            catch (Exception ex)
            {
                throw;
            }

        }


        public SqlConnection SqlOpenConnection()
        {
            try
            {

                // Create and open a connection
                m_sqlConnection = new SqlConnection(m_ConnectionString);
                m_sqlConnection.Open();

                return m_sqlConnection;
            }
            catch (Exception ex)
            {
                throw;
            }

        }
        public bool SqlCloseConnection()
        {
            try
            {
                if (m_sqlConnection == null)
                    return true;
                m_sqlConnection.Close();
                m_sqlConnection.Dispose();
                return true;
            }
            catch (Exception ex)
            {
                throw;
            }

        }


        public SqlTransaction SqlBeginTransaction()
        {
            try
            {
                CheckSqlOpenConnection();
                m_sqlTransaction = m_sqlConnection.BeginTransaction(IsolationLevel.ReadUncommitted);

                return m_sqlTransaction;
            }
            catch (Exception ex)
            {
                throw;
            }

        }

        public bool SqlCommitTransaction()
        {
            try
            {
                m_sqlTransaction.Commit();
                m_sqlTransaction = null;
                return true;
            }
            catch (Exception ex)
            {
                throw;
            }

        }

        public bool SqlRollbackTransaction()
        {
            try
            {
                if (m_sqlTransaction != null)
                {
                    m_sqlTransaction.Rollback();
                    m_sqlTransaction = null;
                }
                return true;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<int> ExecuteNonQueryAsync(string sqlStmt)
        {
            try
            {
                CheckSqlOpenConnection();
                // Create and configure a command
                SqlCommand command = new SqlCommand(sqlStmt, m_sqlConnection);
                if (m_sqlTransaction != null)
                    command.Transaction = m_sqlTransaction;


                // Execute the command
                int numRowsAffected = await command.ExecuteNonQueryAsync();

                // Close and dispose
                command.Dispose();

                // Set return value
                return numRowsAffected;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public int ExecuteNonQuery(string sqlQuery)
        {
            try
            {
                CheckSqlOpenConnection();
                // Create and configure a command
                SqlCommand command = new SqlCommand(sqlQuery, m_sqlConnection);
                if (m_sqlTransaction != null)
                    command.Transaction = m_sqlTransaction;


                // Execute the command
                int numRowsAffected = command.ExecuteNonQuery();

                // Close and dispose
                command.Dispose();

                // Set return value
                return numRowsAffected;
            }
            catch (Exception ex)
            {
                throw;
            }

        }

        public async Task<SqlDataReader> GetDataAsync(string sqlQuery)
        {
            if (m_sqlConnection == null)
                m_sqlConnection = await SqlOpenConnectionAsync();
            else
                CheckSqlOpenConnection();
            try
            {
                // Create and open a connection
                // Create and configure a command
                SqlCommand command = new SqlCommand(sqlQuery, m_sqlConnection);
                if (m_sqlTransaction != null)
                    command.Transaction = m_sqlTransaction;

                SqlDataReader reader = await command.ExecuteReaderAsync();
                return (reader);
            }
            catch (Exception ex)
            {
                throw ;
            }
            finally
            {
                //SqlCloseConnection();
            }
        }

        public SqlDataReader GetData(string sqlQuery)
        {
            if (m_sqlConnection == null)
                m_sqlConnection = SqlOpenConnection();
            else
                CheckSqlOpenConnection();
            try
            {
                // Create and open a connection
                // Create and configure a command
                SqlCommand command = new SqlCommand(sqlQuery, m_sqlConnection);
                if (m_sqlTransaction != null)
                    command.Transaction = m_sqlTransaction;

                SqlDataReader reader = command.ExecuteReader();
                return (reader);
            }
            catch (Exception ex)
            {
                throw ;
            }

        }



    }
}
