namespace backend.Data
{
    public class DAOBase
    {
        public DAOBase() { }

        public bool NVBoolean(object o)
        {
            if (o == DBNull.Value)
            {
                return false;
            }
            else if (o == null)
            {
                return false;
            }
            else
            {
                if (o.ToString() == "0")
                    return false;
                else if (o.ToString() == "1")
                    return true;
                else
                {
                    try
                    {
                        return Convert.ToBoolean(o);
                    }
                    catch (Exception ex)
                    {
                        throw;
                    }

                }


            }
        }

        public string NVString(object o)
        {
            if (o == System.DBNull.Value)
            {
                return "";
            }
            else if (o == null)
            {
                return "";
            }
            else
            {
                try
                {
                    return Convert.ToString(o);
                }
                catch (Exception ex)
                {
                    throw;
                }
            }
        }

        public long NVLong(object o)
        {
            if (o == System.DBNull.Value)
            {
                return 0;
            }
            else if (o == null)
            {
                return 0;
            }
            else
            {
                try
                {
                    return Convert.ToInt64(o);
                }
                catch (Exception ex)
                {
                    throw;
                }
            }
        }

        public decimal NVDecimal(object o)
        {
            if (o == System.DBNull.Value)
            {
                return 0;
            }
            else if (o == null)
            {
                return 0;
            }
            else
            {
                try
                {
                    return Convert.ToDecimal(o);
                }
                catch (Exception ex)
                {
                    throw;
                }
            }
        }

        public float NVFloat(object o)
        {
            if (o == System.DBNull.Value)
            {
                return 0;
            }
            else if (o == null)
            {
                return 0;
            }
            else
            {
                try
                {
                    return Convert.ToSingle(o);
                }
                catch (Exception ex)
                {
                    throw;
                }
            }
        }

        public double NVDouble(object o)
        {
            if (o == System.DBNull.Value)
            {
                return 0.0;
            }
            else if (o == null)
            {
                return 0.0;
            }
            else
            {
                try
                {
                    return Convert.ToDouble(o);
                }
                catch (Exception ex)
                {
                    throw;
                }
            }
        }

        public DateTime NVDateTime(object o)
        {
            if (o == System.DBNull.Value)
            {
                //return 0.0;
                //return new DateTime(0001, 00, 00);
                return new DateTime();
            }
            else if (o == null)
            {
                //return new DateTime(0001, 00, 00);
                return new DateTime();
            }
            else
            {
                try
                {
                    return Convert.ToDateTime(o);
                }
                catch (Exception ex)
                {
                    throw;
                }
            }
        }
    }

}
