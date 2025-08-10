# Optional worker to fetch ticker prices and update the backend SQLite DB.
import yfinance as yf, time, os, sqlite3
DB = os.path.join(os.path.dirname(__file__), '..', 'backend', 'data', 'database.sqlite')
TICKERS = ['TCS.NS','INFY.NS','RELIANCE.NS']

def ensure():
    conn = sqlite3.connect(DB)
    c = conn.cursor()
    try:
        for sym in TICKERS:
            c.execute('INSERT OR IGNORE INTO Tickers (symbol, name, price, change, updated_at) VALUES (?,?,?,?,?)', (sym, sym, 0,0,int(time.time())))
        conn.commit()
    except Exception as e:
        print('ensure error', e)
    conn.close()

while True:
    conn = sqlite3.connect(DB)
    c = conn.cursor()
    for sym in TICKERS:
        try:
            t = yf.Ticker(sym)
            info = t.info
            price = info.get('regularMarketPrice') or info.get('previousClose') or 0
            c.execute('UPDATE Tickers SET price=?, change=?, updated_at=? WHERE symbol=?', (price, 0, int(time.time()), sym))
        except Exception as e:
            print('ticker fetch error', e)
    conn.commit(); conn.close()
    print('tickers updated'); time.sleep(60)
