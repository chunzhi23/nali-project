from flask import Flask, render_template, url_for, redirect, request, session
from bs4 import BeautifulSoup
from googleapiclient.discovery import build
import requests, os
import sqlite3, datetime, json

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY") or os.urandom(24)

def chkDB():
    conn = sqlite3.connect('database.db', isolation_level=None)
    c = conn.cursor()
    c.execute('CREATE TABLE IF NOT EXISTS user_list \
            (uid text, upw text, nickname text)')
    c.execute('CREATE TABLE IF NOT EXISTS music_list \
            (title text, author text, videoID text)')
    c.execute('CREATE TABLE IF NOT EXISTS alarm_list \
            (id integer primary key AUTOINCREMENT, hour integer, minute integer, ampm text, onoff integer)')
    conn.close()

def getUser():
    user_list = {'uid': [], 'upw': [], 'usrn': []}
    conn = sqlite3.connect('database.db', isolation_level=None)
    c = conn.cursor()

    c.execute("SELECT * FROM user_list")
    for item in c.fetchall():
        uid, upw, usrn = item
        user_list['uid'].append(uid)
        user_list['upw'].append(upw)
        user_list['usrn'].append(usrn)

    conn.close()
    return user_list

def getAlarm():
    alarm_list = {'hour': [], 'minute': [], 'ampm': [], 'onoff': []}
    conn = sqlite3.connect('database.db', isolation_level=None)
    c = conn.cursor()

    c.execute("SELECT * FROM alarm_list")
    for item in c.fetchall():
        hour, minute, ampm, onoff = item
        alarm_list['hour'].append(hour)
        alarm_list['minute'].append(minute)
        alarm_list['ampm'].append(ampm)
        alarm_list['onoff'].append(onoff)

    conn.close()
    return alarm_list


@app.route('/')
def root():
    if session.get('logged_in') == True:
        return render_template('pages/home.html', usrn=session['usrn'])
    else:
        return redirect(url_for('login'))


@app.route('/weather')
def weather():
    if session.get('logged_in') == True:
        return render_template('pages/weather.html')
    else:
        return redirect(url_for('login'))


@app.route('/sports')
def sports():
    if session.get('logged_in') == True:
        return render_template('pages/sports.html')
    else:
        return redirect(url_for('login'))


@app.route('/news')
def news():
    if session.get('logged_in') == True:
        return render_template('pages/news.html')
    else:
        return redirect(url_for('login'))


@app.route('/settings')
def settings():
    if session.get('logged_in') == True:
        return render_template('pages/settings.html')
    else:
        return redirect(url_for('login'))


@app.route('/mirror')
def mirror():
    if session.get('logged_in') == True:
        return render_template('interfaces/mirror.html')
    else:
        return redirect(url_for('login'))


@app.route('/parse_user')
def parseUser():
    try:
        ulist = getUser()
        return json.dumps(ulist)
    
    except Exception as e:
        return str(e)


@app.route('/parse_news')
def parseNews():
    try:
        url = 'https://www.yonhapnewstv.co.kr/category/news/headline/feed/'
        res = requests.get(url)
        soup = BeautifulSoup(res.content, 'html.parser')
        
        items = soup.find_all('item')
        news_list = {'tit': [], 'des': [], 'link': []}

        for item in items:
            news_list['tit'].append(item.find('title').text)
            news_list['des'].append(item.find('description').text)
            news_list['link'].append(item.find('comments').text.split('#')[0])
        
        return json.dumps(news_list)
    
    except Exception as e:
        return str(e)


@app.route('/parse_loc', methods=['POST'])
def parseLoc():
    try:
        if request.method == "POST":
            data = request.get_json()
        
            lat = data['lat']
            lng = data['lng']
            latLng = {'lat' : lat, 'lng' : lng}

            naver_url = 'https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc'
            gc_url = "?request=coordsToaddr&coords=%f,%f&sourcecrs=epsg:4326&orders=admcode,legalcode,addr,roadaddr&output=json" % (lng, lat)
            sum_url = naver_url + gc_url
            naver_headers = {
                "X-NCP-APIGW-API-KEY-ID": "[YOUR API KEY ID]", 
                "X-NCP-APIGW-API-KEY": "[YOUR API KEY]"
            }

            naver_api_test = requests.get(sum_url, headers=naver_headers)
            fin_result = {
                'information': json.loads(naver_api_test.text),
                'coords': latLng
            }  

        return json.dumps(fin_result)
    
    except Exception as e:
        return str(e)


@app.route('/parse_kbo')
def parseKBO():
    try:
        url = 'https://www.koreabaseball.com/TeamRank/TeamRank.aspx'
        res = requests.get(url)
        soup = BeautifulSoup(res.content, 'html.parser')
        
        res_list = {'team': [], 'win': [], 'lose': [], 'tie': [], 'rate': [], 'behind': []}
        
        table = soup.find('table', {'class':'tData'})
        trs = table.find_all('tr')
        for tr in trs:
            tds = tr.find_all('td')
            for idx, td in enumerate(tds):
                if idx == 1:
                    res_list['team'].append(td.text)
                elif idx == 3:
                    res_list['win'].append(td.text)
                elif idx == 4:
                    res_list['lose'].append(td.text)
                elif idx == 5:
                    res_list['tie'].append(td.text)
                elif idx == 6:
                    res_list['rate'].append(td.text)
                elif idx == 7:
                    res_list['behind'].append(td.text)

        return json.dumps(res_list)

    except Exception as e:
        return str(e)


@app.route('/parse_premier')
def parsePremier():
    try:
        now = datetime.date.today()
        pd01 = now + datetime.timedelta(days=1)
        pd30 = now + datetime.timedelta(days=30)
        url = 'https://sports.daum.net/prx/hermes/api/game/schedule.json?page=1&leagueCode=epl&fromDate=%s&toDate=%s' % (pd01.strftime("%Y%m%d"), pd30.strftime("%Y%m%d"))
        res = requests.get(url)
        jsonDict = res.json()
        
        dailyRec = list(jsonDict['schedule'].keys())
        dailyRec.sort()
        
        ret = list()
        for key in dailyRec:
            ret.append(jsonDict['schedule'][key])
            
        return json.dumps(ret)

    except Exception as e:
        return str(e)


@app.route('/parse_ksp')
def parseKsp():
    try:
        url = 'https://www.kleague.com/getScheduleList.do'
        res = requests.post(url, json={'key':'value'})
        jsonDict = res.json()
        
        ret = list()
        now = datetime.date.today()
        for idx, item in enumerate(jsonDict['data']['scheduleList']):
            date = ''.join(item['gameDate'].split('.'))
            if date > now.strftime('%Y%m%d'):
                ret.append(jsonDict['data']['scheduleList'][idx])

        return json.dumps(ret)
    except Exception as e:
        return str(e)


@app.route('/parse_stock')
def parseStock():
    try:
        url = 'http://stock.hankyung.com/apps/rank.portfolio'
        res = requests.get(url)
        soup = BeautifulSoup(res.content, 'html.parser')

        res_list = {'name': [], 'val': [], 'change': []}
        tbody = soup.find('tbody', {'id':'contentsList'})
        trs = tbody.find_all('tr')
        for idx, tr in enumerate(trs):
            if idx > 5: break

            tds = tr.find_all('td')
            for i, td in enumerate(tds):
                if i == 1:
                    res_list['name'].append(td.text)
                elif i == 2:
                    res_list['val'].append(td.text)
                elif i == 4:
                    res_list['change'].append(td.text)
        
        return json.dumps(res_list)

    except Exception as e:
        return str(e)


@app.route('/parse_COVID')
def parseCOVID():
    try:
        url = 'http://ncov.mohw.go.kr/'
        res = requests.get(url)
        soup = BeautifulSoup(res.content, 'html.parser')
        
        res_list = []
        table = soup.find('table', {'class':'ds_table'})
        tbody = table.find('tbody')
        tr = tbody.find('tr')
        tds = tr.find_all('td')
        for idx, td in enumerate(tds):
            if idx == 3:
                res_list.append(td.text)

        st = soup.find('span', {'class':'livedate'})
        res_list.append(st.text)

        return json.dumps(res_list)
    
    except Exception as e:
        return str(e)


@app.route('/parse_youtube/<cmd>')
def parseYoutube(cmd):
    try:
        DEVELOPER_KEY = '[YOUR DEVELOPER KEY]'
        YOUTUBE_API_SERVICE_NAME = 'youtube'
        YOUTUBE_API_VERSION = 'v3'
        youtube = build(
            YOUTUBE_API_SERVICE_NAME, 
            YOUTUBE_API_VERSION, 
            developerKey=DEVELOPER_KEY)
        res = youtube.search().list(
            q=cmd,
            order='relevance',
            part='snippet',
            maxResults = 20
        ).execute()

        return json.dumps(res)

    except Exception as e:
        return str(e)


@app.route('/parse_music')
def parseMusic():
    try:
        music_list = {'title': [], 'author': []}
        conn = sqlite3.connect('database.db', isolation_level=None)
        c = conn.cursor()
        
        c.execute("SELECT * FROM music_list")
        for item in c.fetchall():
            title, author, videoID = item
            music_list['title'].append(title)
            music_list['author'].append(author)
            
        conn.close()

        return json.dumps(music_list)

    except Exception as e:
        return str(e)


@app.route('/register')
def register():
    if session.get('logged_in') == True:
        return redirect(url_for('root'))
    else:
        return render_template('interfaces/register.html')
    

@app.route('/register_proc', methods=['POST'])
def register_proc():
    uid = request.form['id']
    upw = request.form['pw']
    name = request.form['name']

    conn = sqlite3.connect('database.db', isolation_level=None)
    c = conn.cursor()
    c.execute("INSERT INTO user_list(uid, upw, nickname) VALUES(?,?,?)", (uid, upw, name))
    c.execute("INSERT INTO alarm_list(hour, minute, ampm, onoff) VALUES(?,?,?,?)", (6,30,'AM',0))
    ulist = getUser()
    conn.close()
    
    session['uid'] = uid

    idx = ulist['uid'].index(uid)
    session['usrn'] = ulist['usrn'][idx]
    session['logged_in'] = True
    
    return redirect(url_for('root'))


@app.route('/login')
def login():
    if session.get('logged_in') == True:
        return redirect(url_for('root'))
    else:
        return render_template('interfaces/login.html')


@app.route('/login_proc', methods=['POST'])
def login_proc():
    ulist = getUser()

    uid = request.form['id']
    upw = request.form['pw']
    if uid in ulist['uid']:
        session['userIdx'] = ulist['uid'].index(uid)
        if upw == ulist['upw'][session['userIdx']]:
            session['uid'] = uid
            session['usrn'] = ulist['usrn'][session['userIdx']]
            session['logged_in'] = True
            
            return redirect(url_for('root'))
    else:
        return redirect(url_for('login'))
    

@app.route('/logout_proc')
def logout():
    session.pop('logged_in', None)
    return redirect(url_for('login'))


@app.route('/music_proc', methods=['POST'])
def musicUpload():
    musicID_list = []
    if request.method == "POST":
        data = request.get_json()
        
        utitle = data['title']
        uauthor = data['author']
        uvideoID = data['videoID']
        
        conn = sqlite3.connect('database.db', isolation_level=None)
        c = conn.cursor()
        
        c.execute("SELECT * FROM music_list")
        for item in c.fetchall():
            title, author, videoID = item
            musicID_list.append(videoID)
        
        if uvideoID not in musicID_list:
            c.execute("INSERT INTO music_list(title, author, videoID) VALUES(?,?,?)", (utitle, uauthor, uvideoID))
        conn.close()

    return json.dumps({'res': 200})


@app.route('/alarm_proc', methods=['POST'])
def alarmUpload():
    if request.method == "POST":
        data = request.get_json()
        USER_INDEX = session['userIdx']+1

        session['hour'] = data['hour']
        session['minute'] = data['minute']
        session['ampm'] = data['ampm']
        session['onoff'] = data['onoff']

        conn = sqlite3.connect('database.db', isolation_level=None)
        c = conn.cursor()

        c.execute("UPDATE alarm_list SET hour=? WHERE id=?", (session['hour'], USER_INDEX))
        c.execute("UPDATE alarm_list SET minute=? WHERE id=?", (session['minute'], USER_INDEX))
        c.execute("UPDATE alarm_list SET ampm=? WHERE id=?", (session['ampm'], USER_INDEX))
        c.execute("UPDATE alarm_list SET onoff=? WHERE id=?", (session['onoff'], USER_INDEX))
        conn.close()
    
    return json.dumps({'res': 200})


if __name__ == '__main__':
    chkDB()
    app.run(host='0.0.0.0', port=8080, debug=True)
