#!/usr/bin/env python

################################################################################################################################################################
# 모듈 로드
import os
import sys
import time
import random
import re
import json
import urllib.parse

import pymysql # [Document]https://pymysql.readthedocs.io/en/latest/user/index.html
import requests
from bs4 import BeautifulSoup
#
################################################################################################################################################################
# 전역 상수 및 변수
from DB_CONST import STR_DB_HOST # MariaDB IP
from DB_CONST import INT_DB_PORT # MariaDB Port
from DB_CONST import STR_DB_NAME # MariaDB DataBase Name
from DB_CONST import STR_DB_USER # MariaDB User
from DB_CONST import STR_DB_PASS # MariaDB Password

INT_REQUEST_COUNT = 0
INT_ERROR_CNT = 0
STR_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36'
STR_MOBILE_AGENT = 'Mozilla/5.0 (Linux; Android 6.0.1; Moto G (4)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Mobile Safari/537.36'
#
################################################################################################################################################################



################################################################################################################################################################
# 타  입: 함수
# 작성자: 강도영 / 작성일: 2020.11.22. / 수정자: 강도영 / 수정일: 2020.11.22.
# 설  명: UTF8 문자열을 URL을 인코딩해준다.
# 사용법: URLEncode([String]인코딩할 문자열): [String]인코딩된 문자열
# 세  부: 가나다 -> %EA%B0%80%EB%82%98%EB%8B%A4

def URLEncode(StrContent):
    return urllib.parse.quote(StrContent)

################################################################################################################################################################
# 타  입: 프로시저
# 작성자: 강도영 / 작성일: 2020.11.22. / 수정자: 강도영 / 수정일: 2020.11.22.
# 설  명: 프로그램 작업 내역을 파일로 기록한다.
# 사용법: SaveLog([String]로그내용, [opt Boolean]Print 여부)
# 세  부: 크롤링.log에 로그를 남긴다.

def SaveLog(StrLog, ChkPrint=True):
    # 현재 시간을 담아준다.
    StrDateTime = time.strftime('%Y-%m-%d %T')

    # ChkPrint가 True일시 콘솔에 로그내역을 보여준다.
    if ChkPrint:
        print(StrDateTime, '/', StrLog)

    # 파일에 로그를 저장한다.
    hFile = open(r'.\크롤링.log', 'a', encoding='UTF8')
    hFile.write(StrDateTime+ ': ' +StrLog +'\n')
    hFile.close()

################################################################################################################################################################
# 타  입: 함수
# 작성자: 강도영 / 작성일: 2020.11.22. / 수정자: 강도영 / 수정일: 2020.11.22.
# 설  명: 에러를 핸들링해준다.
# 사용법: ErrorHandler([String]파이썬 에러 로그, [String]사용자 에러 로그): [Boolean]작동 멈춤 체크
# 세  부: INT_ERROR_CNT가 3 이상(3회 이상 에러)일때 True 리턴

def ErrorHandler(Error, TmpStr1):
    global INT_ERROR_CNT

    # 로그를 보여주고
    SaveLog(TmpStr1 +': ' +Error)

    # 3회 이상 에러 떴는지 확인 후
    if INT_ERROR_CNT >= 1:
        # 3회 이상일땐 로그를 남기고 True 리턴
        SaveLog('3회 이상 에러가 발생하였습니다.')
        INT_ERROR_CNT = 0
        return True
    else:
        # 3회 미만일땐 에러 카운트를 1 증가 후 False 리턴
        INT_ERROR_CNT += 1
        return False

################################################################################################################################################################
# 타  입: 함수
# 작성자: 강도영 / 작성일: 2020.11.22. / 수정자: 강도영 / 수정일: 2020.11.22.
# 설  명: MariaDB Connection Handle
# 사용법: MariaDBConnect(): [TObject]MariaDB Connection Handle
# 세  부: 

def MariaDBConnect():
    global INT_ERROR_CNT

    # 에러 카운트 초기화
    INT_ERROR_CNT = 0

    # MariaDB 핸들 구해옴
    while True:
        try:
            return pymysql.connect(host=STR_DB_HOST, port=INT_DB_PORT, user=STR_DB_USER, passwd=STR_DB_PASS, db=STR_DB_NAME, charset='UTF8')
        except Exception as Error:
            # 에러 핸들러
            if ErrorHandler(repr(Error), '[MariaDBConnect] 연결 실패'):
                input('?? 로그를 확인해주세요')
                sys.exit()
            time.sleep(10)

################################################################################################################################################################
# 타  입: 함수
# 작성자: 강도영 / 작성일: 2020.11.22. / 수정자: 강도영 / 수정일: 2020.11.22.
# 설  명: BeautifulSoup의 Element에서 Text값을 구해온다. 없으면 None
# 사용법: GetElementText([TObject]bs4 Elements, [String]찾을 객체 XPath): [String]Element InnerHTML
# 세  부: 

def GetElementText(ObjElements, StrXPath):
    # 리턴값 초기화
    Result = None

    # ObjElements에서 XPath기준으로 Element를 찾아줌
    TmpEle1 = ObjElements.select_one(StrXPath)

    # 찾았을경우 InnerHTML 리턴 or None 리턴
    if TmpEle1:
        Result = TmpEle1.text

    return Result

################################################################################################################################################################
# 타  입: 함수
# 작성자: 강도영 / 작성일: 2020.11.22. / 수정자: 강도영 / 수정일: 2020.11.22.
# 설  명: 시작 문자열과 끝나는 문자열 사이의 문자열을 찾아준다.
# 사용법: SplitStr([String]전체 문자열, [String]시작 문자열, [String]끝나는 문자열): [String]중간 문자열
# 세  부: 못찾을경우 빈 문자열 리턴

def SplitStr(StrContent, StrFirst, StrLast):
    # 시작 문자열을 StrContent에서 못찾을 경우 빈 문자열 리턴
    TmpInt1 = StrContent.find(StrFirst)
    if TmpInt1 < 0:
        return ''
    Result = StrContent[TmpInt1 +len(StrFirst):]

    # 시작 문자열을 Result에서 못찾을 경우 빈 문자열 리턴
    TmpInt1 = Result.find(StrLast)
    if TmpInt1 < 0:
        return ''
    Result = Result[:TmpInt1]

    return Result

################################################################################################################################################################
# 타  입: 프로시저
# 작성자: 강도영 / 작성일: 2020.11.22. / 수정자: 강도영 / 수정일: 2020.11.22.
# 설  명: 크롤링시 서버 과부하를 막기위해 Sleep 추가
# 사용법: CrawlingSleep()
# 세  부: 호출당 0.5~1.5초, 1000건당 30~60초 Sleep

def CrawlingSleep():
    global INT_REQUEST_COUNT

    # 호출 카운트 증가
    INT_REQUEST_COUNT += 1

    # 1000건 이상일 경우 추가휴식
    if INT_REQUEST_COUNT > 1000:
        SaveLog('30초간 쉬었다가 갑니다')
        time.sleep(random.randint(30, 60))
        INT_REQUEST_COUNT = 0

    time.sleep(0.5 +random.random())



################################################################################################################################################################
################################################################################################################################################################
# 멜론 크롤링
################################################################################################################################################################

################################################################################################################################################################
# 타  입: 함수
# 작성자: 강도영 / 작성일: 2020.11.22. / 수정자: 강도영 / 수정일: 2020.11.22.
# 설  명: 멜론 DJ 리스트에서 사용자들이 주로 입력하는 자동완성을 이용 찾기
# 사용법: GetMelonTag([String]검색 할 키워드): [Integer]검색된 태그 갯수
# 세  부: 한글 음절 11,172자를 크롤링하기 때문에 txt에 작성한 로그 남기고 PLAYLIST_TAG 테이블에 태그ID, 상태값, 플레이리스트 크롤링 날짜 넣어줌.

def GetMelonTag(StrKeyword):
    global INT_ERROR_CNT

    # 리턴값 초기화
    Result = 0

    # 멜론서버에서 접속하여 크롤링할때 연결 한번씩 끊어버려 반복, 예외문 넣음
    INT_ERROR_CNT = 0
    while True:
        try:
            # 키워드 검색
            # 멜론DJ 페이지[https://www.melon.com/dj/today/djtoday_list.htm]의 검색패널에서 찾음
            response = requests.request(
                method = 'POST',
                url = 'https://www.melon.com/dj/djfinder/listTagPredictiveText.json',
                headers = {
                    'Accept': 'application/json, text/javascript, */*; q=0.01',
                    'DNT': '1',
                    'X-Requested-With': 'XMLHttpRequest',
                    'User-Agent': STR_USER_AGENT,
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Origin': 'https://www.melon.com',
                    'Sec-Fetch-Site': 'same-origin',
                    'Sec-Fetch-Mode': 'cors',
                    'Sec-Fetch-Dest': 'empty',
                    'Referer': 'https://www.melon.com/dj/today/djtoday_list.htm',
                    'Accept-Encoding': 'deflate',
                    'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7,zh-CN;q=0.6,zh;q=0.5'
                },
                data = {
                    'keyword': URLEncode(StrKeyword)
                }
            )
            break
        except Exception as Error:
            if ErrorHandler(repr(Error), '[GetMelonTag] Request 실패'):
                input('로그를 확인해주세요')
            time.sleep(5)

    # 검색한 키워드를 JSON 타입으로 받아옴
    TmpJsn1 = response.json()

    # 받아온 JSON에 tagList가 없으면 결과값 False, 있으면 PLAYLIST_TAG에 저장후 True 반환
    if 'tagList' in TmpJsn1:
        LstTag = [TmpJsn1['TAGSEQ'] for TmpJsn1 in TmpJsn1['tagList']]
        hCon = MariaDBConnect()
        try:
            hCur = hCon.cursor()
            hCur.executemany('INSERT IGNORE INTO PLAYLIST_TAG (PT_INDEX) VALUES (%s)', LstTag)
            Result = len(LstTag)
        finally:
            hCon.commit()
            hCon.close()

    return Result

################################################################################################################################################################
# 타  입: 폼
# 작성자: 강도영 / 작성일: 2020.11.22. / 수정자: 강도영 / 수정일: 2020.11.22.
# 설  명: 멜론 DJ 리스트에서 사용자들이 주로 입력하는 검색어 자동완성을 이용 찾기
# 사용법: FrmGetMelonTag()
# 세  부: 한글 음절 11,172자를 크롤링하기 때문에 txt에 작성한 로그 남기고 PLAYLIST_TAG 테이블에 태그ID, 상태값, 플레이리스트 크롤링 날짜 넣어줌.

def FrmGetMelonTag():
    global INT_ERROR_CNT

    # 한글 음절 11,172개를 불러옴
    if not os.path.isfile(r'.\korean syllable.txt'):
        SaveLog(r'".\korean syllable.txt" 파일이 없습니다.')
        sys.exit()
    else:
        hFile = open(r'.\korean syllable.txt', 'r', encoding='UTF8')
        LstSyllable = list(hFile.readline().strip('\n'))
        hFile.close()

    # 중간에 종료되더라도 중간부터 시작 가능하게 완료된 한글 음절 불러옴
    if os.path.isfile(r'.\태그_검색.log'):
        hFile = open(r'.\태그_검색.log', 'r', encoding='UTF8')
        LstTagLog = hFile.read().splitlines()
        hFile.close()
    else:
        LstTagLog = []

    # 저장할 한글 음절
    TmpStr1 = ''
    # 멜론에 한글 음절 검색하여 태그명 크롤링
    SaveLog('[FrmGetMelonTag] 태그 정보 수집')
    for TmpInt1, StrSyllable in enumerate(LstSyllable):
        # 이미 크롤링했으면 넘어감
        if StrSyllable in LstTagLog:
            continue

        # 크롤링
        GetMelonTag(StrSyllable)
        TmpStr1 += StrSyllable

        # 크롤링 15회마다 크롤링한 음절 로그로 저장 후 3초 쉼
        if TmpInt1 %15 == 0:
            hFile = open(r'.\태그_검색.log', 'a', encoding='UTF8')
            hFile.write(TmpStr1)
            hFile.close()
            TmpStr1 = ''
            time.sleep(5)

    # 마지막 로그 남김
    if TmpStr != '':
        hFile = open(r'.\태그_검색.log', 'a', encoding='UTF8')
        hFile.write(TmpStr1)
        hFile.close()

    SaveLog('[FrmGetMelonTag] 태그 검색 완료!!')
    input('')



################################################################################################################################################################
# 타  입: 함수
# 작성자: 강도영 / 작성일: 2020.11.22. / 수정자: 강도영 / 수정일: 2020.11.22.
# 설  명: 다음 페이지가 존재하는지 찾음
# 사용법: ChkMelonPageValid([Object]Element, [Integer]찾을 페이지 넘버): [Boolean]페이지 넘버를 찾으면 True
# 세  부: 

def ChkMelonPageValid(ObjBS, IntPageNo):
    # 리턴값 초기화
    Result = False

    # script 태그 리스트 추춘
    LstScriptEle = ObjBS.select('script')
    for EleScript in LstScriptEle:
        # script안의 내용이 존재하고
        TmpStr1 = EleScript.string
        if TmpStr1:
            # 해당 script가 페이지 정보를 담았다면
            TmpInt1 = TmpStr1.find('$(\'#pageObjNavgation\').html(')
            if TmpInt1 >= 0:
                # 해당 페이지가 존재하는지 체크
                TmpStr1 = TmpStr1[TmpInt1:]
                TmpStr1 = TmpStr1[:TmpStr1.find(r'\n')]
                if TmpStr1.find('sendPage(\\\'' +str(IntPageNo) +'\\\')') >= 0:
                    Result = True

    return Result

################################################################################################################################################################
# 타  입: 프로시저
# 작성자: 강도영 / 작성일: 2020.11.22. / 수정자: 강도영 / 수정일: 2020.11.22.
# 설  명: 해당 플레이리스트의 곡정보를 구해와 최종적으로 DB에 추가한다.
# 사용법: GetMelonPlayListMusic([Integer]태그ID, [String]플레이리스트ID, [String]플레이리스트 좋아요 갯수)
# 세  부: 

def GetMelonPlayListMusic(IntTagID, StrPlayListID, StrLikeCnt):
    global INT_ERROR_CNT

    # 초기값 초기화
    INT_ERROR_CNT = 0
    LstTagInfo = []
    LstPlayListInfo = [] # 플레이리스트 정보
    LstPlayListCon = [] # 플레이리스트ID와 곡ID 연동
    LstMusicInfo = [] # 곡 정보

    SaveLog('[GetMelonPlayListMusic] 플레이리스트ID: ' +StrPlayListID)

    ChkExit = False
    while True:
        try:
            # 플레이리스트의 곡정보 조회
            # 멜론DJ 페이지[https://www.melon.com/dj/tag/djtaghub_list.htm?~~~~]에서 플레이리스트 선택하면 나옴
            response = requests.request(
                method = 'GET',
                url = 'https://www.melon.com/mymusic/dj/mymusicdjplaylistview_inform.htm?plylstSeq=' +StrPlayListID,
                headers = {
                    'Upgrade-Insecure-Requests': '1',
                    'DNT': '1',
                    'User-Agent': STR_USER_AGENT,
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                    'Sec-Fetch-Site': 'same-origin',
                    'Sec-Fetch-Mode': 'navigate',
                    'Sec-Fetch-User': '?1',
                    'Sec-Fetch-Dest': 'document',
                    'Referer': 'https://www.melon.com/dj/tag/djtaghub_list.htm?tagSeq=' +str(IntTagID),
                    'Accept-Encoding': 'deflate',
                    'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7,zh-CN;q=0.6,zh;q=0.5'
                }
            )
            CrawlingSleep()
            ObjBS = BeautifulSoup(response.text, 'html.parser')

            # 태그 정보
            LstTagEle = ObjBS.select('div.tag_list.type03 > a')
            # 플레이리스트 곡 정보
            LstMusicEle = ObjBS.select('div.service_list_song > table > tbody > tr')

            # Request 에러 예방
            if (len(LstTagEle) != 0) and (len(LstMusicEle) != 0):
                break
            else:
                if ObjBS.select_one('p.txt_emphs'):
                    ChkExit = True
                raise Exception('Error')
        except Exception as Error:
            if ErrorHandler(repr(Error), '[GetMelonPlayListMusic] Request 실패'):
                INT_ERROR_CNT = 0
                SaveLog('수집 실패, 다음곡으로 넘어갑니다.')
                ChkExit = True
                break
            time.sleep(10)

    if ChkExit:
        hCon = MariaDBConnect()
        try:
            hCur = hCon.cursor()
            hCur.execute('INSERT IGNORE INTO PLAYLIST_INFO (PI_INDEX, PI_TAG_ID01, PI_TAG_ID02, PI_TAG_ID03, PI_TAG_ID04, PI_TAG_ID05, PI_TAG_ID06, PI_TAG_ID07, ' +
                         'PI_TAG_ID08, PI_TAG_ID09, PI_TAG_ID10, PI_LIKE_CNT, PI_CRAWLING_DATE) VALUES (%s, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, CURDATE())', StrPlayListID)
        finally:
            hCon.commit()
            hCon.close()
        return 0

    # 태그 정보 정리
    for TmpEle1 in LstTagEle:
        LstTagInfo.append(SplitStr(TmpEle1['href'], '.goDjTagHub(\'', '\''))

    # 플레이리스트 정보 정리
    LstPlayListInfo.append(StrPlayListID)
    LstPlayListInfo += LstTagInfo
    for _ in range(len(LstTagInfo) +1, 11):
        LstPlayListInfo.append('0')
    LstPlayListInfo.append(StrLikeCnt)

    # 곡 갯수를 구해온다
    IntSongCnt = 0
    TmpStr1 = GetElementText(ObjBS, 'h5.title > span.sum')
    if TmpStr1:
        IntSongCnt = int(TmpStr1[1:-1])

    # 50개 이상이면 모바일 멜론에서 곡 정보 수집
    if IntSongCnt > 50:
        while True:
            try:
                response = requests.request(
                    method = 'GET',
                    url = 'https://m2.melon.com/landing/playList.htm?type=djc&plylstTypeCode=M20002&plylstSeq=' +StrPlayListID,
                    headers = {
                        'Upgrade-Insecure-Requests': '1',
                        'DNT': '1',
                        'User-Agent': STR_MOBILE_AGENT,
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                        'Sec-Fetch-Site': 'cross-site',
                        'Sec-Fetch-Mode': 'navigate',
                        'Sec-Fetch-Dest': 'document',
                        'Referer': 'http://m.melon.com/',
                        'Accept-Encoding': 'deflate',
                        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7,zh-CN;q=0.6,zh;q=0.5'
                    }
                )
                # 일부러 2개 넣어놈...
                #'##CrawlingSleep()
                CrawlingSleep()
                ObjBS = BeautifulSoup(response.text, 'html.parser')

                # 플레이리스트 곡 정보
                LstMusicEle = ObjBS.select('ul.service_list.list_music > li')

                # Request 에러 예방
                if len(LstMusicEle) != 0:
                    break
                else:
                    raise Exception('Error')
            except Exception as Error:
                if ErrorHandler(repr(Error), '[GetMelonPlayListMusic] Request 실패 2'):
                    input('?? 로그를 확인해주세요')
                time.sleep(10)

        # 곡 정보 구해옴
        for TmpEle1 in LstMusicEle:
            # 곡ID
            StrSongID = SplitStr(TmpEle1.select_one('div.content > div.inner > a')['href'], 'goDetail(\'song\',\'', '\'')
            # 곡명
            TmpEle2 = TmpEle1.select_one('p.title')
            LstTempElement = TmpEle2.select('*')
            for TmpEle3 in LstTempElement:
                TmpEle3.extract()
            StrSongName = TmpEle2.text.strip()
            # 아티스트명
            StrSongArtist = GetElementText(TmpEle1, 'span.name')
            if StrSongArtist == '':
                StrSongArtist = 'Various Artists'
            # 커넥션 테이블, 곡정보 테이블 값 넣어줌
            LstPlayListCon.append([StrPlayListID, StrSongID])
            LstMusicInfo.append([StrSongID, StrSongName, StrSongArtist, 0])
    else:
        for TmpEle1 in LstMusicEle:
            StrSongID = SplitStr(TmpEle1.select_one('td > div.wrap > a.button_icons')['href'], '.goSongDetail(\'', '\'')
            StrSongName = TmpEle1.select_one('div.wrap_song_info > div.rank01 span > a').text
            StrSongArtist = GetElementText(TmpEle1, 'div.wrap_song_info > div.rank02 > a')
            if StrSongArtist == '':
                StrSongArtist = 'Various Artists'
            LstPlayListCon.append([StrPlayListID, StrSongID])
            LstMusicInfo.append([StrSongID, StrSongName, StrSongArtist, 0])

    # 곡의 좋아요 갯수 구해옴
    TmpInt1 = 0
    LstSongLikeCnt = []
    StrURL = 'https://www.melon.com/commonlike/getSongLike.json?contsIds='
    for TmpLst1 in LstMusicInfo:
        TmpInt1 += 1
        StrURL += TmpLst1[0] +'%2C'

        # 500개 단위로 추천 받아옴
        if (TmpInt1 %500 == 0) or (TmpInt1 == len(LstMusicInfo)):
            while True:
                try:
                    response = requests.request(
                        method = 'GET',
                        url = StrURL[:-3],
                        headers = {
                            'Accept': '*/*',
                            'DNT': '1',
                            'X-Requested-With': 'XMLHttpRequest',
                            'User-Agent': STR_USER_AGENT,
                            'Sec-Fetch-Site': 'same-origin',
                            'Sec-Fetch-Mode': 'cors',
                            'Sec-Fetch-Dest': 'empty',
                            'Referer': 'https://www.melon.com/mymusic/dj/mymusicdjplaylistview_inform.htm?plylstSeq=' +StrPlayListID,
                            'Accept-Encoding': 'deflate',
                            'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7,zh-CN;q=0.6,zh;q=0.5'
                        }
                    )
                    CrawlingSleep()
                    TmpJsn1 = response.json()
                    if len(TmpJsn1['contsLike']) == TmpInt1%500 if TmpInt1%500 != 0 else 500:
                        break
                    else:
                        raise Exception('Error')
                except Exception as Error:
                    if ErrorHandler(repr(Error), '[GetMelonPlayListMusic] Request 실패 3'):
                        input('?? 로그를 확인해주세요')
                    time.sleep(10)
            LstSongLikeCnt += TmpJsn1['contsLike']
            StrURL = 'https://www.melon.com/commonlike/getSongLike.json?contsIds='

    for TmpInt1, TmpLst1 in enumerate(LstMusicInfo):
        TmpLst1[3] = LstSongLikeCnt[TmpInt1]['SUMMCNT']

    hCon = MariaDBConnect()
    try:
        hCur = hCon.cursor()
        hCur.executemany('INSERT IGNORE INTO PLAYLIST_TAG (PT_INDEX, PT_STATUS) VALUES (%s, 3)', LstTagInfo)
        hCur.execute('INSERT IGNORE INTO PLAYLIST_INFO (PI_INDEX, PI_TAG_ID01, PI_TAG_ID02, PI_TAG_ID03, PI_TAG_ID04, PI_TAG_ID05, PI_TAG_ID06, PI_TAG_ID07, ' +
                     'PI_TAG_ID08, PI_TAG_ID09, PI_TAG_ID10, PI_LIKE_CNT, PI_CRAWLING_DATE) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, CURDATE())', LstPlayListInfo)
        hCur.executemany('INSERT IGNORE INTO MUSIC_PRE (MU_INDEX, MU_MUSIC_NAME, MU_ARTIST_NAME, MU_LIKE_CNT, MU_CRAWLING_DATE) VALUES (%s, %s, %s, %s, CURDATE())', LstMusicInfo)
        hCur.executemany('INSERT IGNORE INTO PLAYLIST_MUSIC_CON (CM_PI_INDEX, CM_MU_INDEX) VALUES (%s, %s)', LstPlayListCon)
    finally:
        hCon.commit()
        hCon.close()


################################################################################################################################################################
# 타  입: 프로시저
# 작성자: 강도영 / 작성일: 2020.11.22. / 수정자: 강도영 / 수정일: 2020.11.22.
# 설  명: 태그ID 값으로 플레이리스트 목록을 크롤링
# 사용법: GetMelonPlayList([String]태그ID, [Integer]크롤링할 페이지)
# 세  부: 

def GetMelonPlayList(IntTagID, IntStartPage):
    global INT_ERROR_CNT

    INT_ERROR_CNT = 0
    SaveLog('[GetMelonPlayList] 태그ID: ' +str(IntTagID) +' / 페이지ID: ' +str(IntStartPage))

    while True:
        try:
            # 플레이리스트 목록 조회
            # 멜론DJ 페이지[https://www.melon.com/dj/themegenre/djthemegenre_list.htm]에서 태그 선택 페이지에서 찾음
            response = requests.request(
                method = 'GET',
                url = 'https://www.melon.com/dj/tag/djtaghub_list.htm?startIndex=' +str(IntStartPage) +'&pageSize=20&tagSeq=' +str(IntTagID) +'&orderBy=NEW',
                headers = {
                    'Accept': '*/*',
                    'DNT': '1',
                    'X-Requested-With': 'XMLHttpRequest',
                    'User-Agent': STR_USER_AGENT,
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Sec-Fetch-Site': 'same-origin',
                    'Sec-Fetch-Mode': 'cors',
                    'Sec-Fetch-Dest': 'empty',
                    'Referer': 'https://www.melon.com/dj/tag/djtaghub_list.htm?tagSeq=' +str(IntTagID),
                    'Accept-Encoding': 'deflate',
                    'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7,zh-CN;q=0.6,zh;q=0.5'
                }
            )
            CrawlingSleep()
            ObjBS = BeautifulSoup(response.text, 'html.parser')

            # 플레이리스트 정보
            LstPlayListEle = ObjBS.select('div.service_list_play > ul > li')

            # Request 에러 예방
            if len(LstPlayListEle) > 0:
                break
            else:
                raise Exception('Error')
        except Exception as Error:
            if ErrorHandler(repr(Error), '[GetMelonPlayList] Request 실패'):
                SaveLog('[GetMelonPlayList] 플레이리스트를 구할 수 없습니다.')
                return 0
            time.sleep(10)

    # 플레이리스트의 좋아요 갯수 구하기
    StrURL = 'https://www.melon.com/dj/common/djcommon_listLikeCnt.json?contsIds='
    for TmpEle1 in LstPlayListEle:
        StrURL += TmpEle1.select_one('div.entry > div.meta > button')['data-djcol-no'] +'%2C'

    while True:
        try:
            response = requests.request(
                method = 'GET',
                url = StrURL[:-3],
                headers = {
                    'Accept': '*/*',
                    'DNT': '1',
                    'X-Requested-With': 'XMLHttpRequest',
                    'User-Agent': STR_USER_AGENT,
                    'Sec-Fetch-Site': 'same-origin',
                    'Sec-Fetch-Mode': 'cors',
                    'Sec-Fetch-Dest': 'empty',
                    'Referer': 'https://www.melon.com/dj/tag/djtaghub_list.htm?tagSeq=' +str(IntTagID),
                    'Accept-Encoding': 'deflate',
                    'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7,zh-CN;q=0.6,zh;q=0.5'
                }
            )
            CrawlingSleep()
            TmpJsn1 = response.json()
            if len(TmpJsn1['contsLike']) == len(LstPlayListEle):
                break
            else:
                raise Exception('Error')
        except Exception as Error:
            if ErrorHandler(repr(Error), '[GetMelonPlayList] Request 실패 2'):
                input('?? 로그를 확인해주세요')
            time.sleep(10)

    # 플레이리스트 목록안의 곡 정보 구하기
    for TmpInt1, TmpEle1 in enumerate(LstPlayListEle):
        # 플레이리스트가 삭제된 경우 무시
        TmpEle2 = TmpEle1.select_one('div.thumb > a')
        if TmpEle2['href'].find('\'Y\',\'Y\'') >= 0:
            continue

        TmpEle2 = TmpEle1.select_one('div.entry > div.meta > button')

        # 이미 크롤링한 곡 정보면 스킵
        Chk01 = False
        hCon = MariaDBConnect()
        try:
            hCur = hCon.cursor()
            hCur.execute('SELECT PI_INDEX FROM PLAYLIST_INFO WHERE PI_INDEX = %s', TmpEle2['data-djcol-no'])
            LstQuery = hCur.fetchall()
            if len(LstQuery) > 0:
                Chk01 = True
        finally:
            hCon.close()

        if not Chk01:
            GetMelonPlayListMusic(IntTagID, TmpEle2['data-djcol-no'], TmpJsn1['contsLike'][TmpInt1]['SUMMCNT'])

    if ChkMelonPageValid(ObjBS, IntStartPage +20):
        GetMelonPlayList(IntTagID, IntStartPage +20)

################################################################################################################################################################
# 타  입: 폼
# 작성자: 강도영 / 작성일: 2020.11.22. / 수정자: 강도영 / 수정일: 2020.11.22.
# 설  명: 긁어온 태그 리스트에서 플레이리스트 크롤링
# 사용법: FrmGetMelonPlayList()
# 세  부: 

def FrmGetMelonPlayList():
    SaveLog('[FrmGetMelonPlayList] 플레이리스트 크롤링 시작')
    while True:
        # PLAYLIST_TAG에서 PT_STATUS 값이 0인것을 1개만 읽고 1로 바꿔준다.
        hCon = MariaDBConnect()
        try:
            hCur = hCon.cursor()
            hCur.execute('SELECT PT_INDEX FROM PLAYLIST_TAG WHERE PT_STATUS = 0 LIMIT 1 FOR UPDATE')
            LstQuery = hCur.fetchone()
            # SELECT 되면 1로 업데이트 아니면 종료
            if len(LstQuery) > 0:
                IntTagID = LstQuery[0]
                hCur.execute('UPDATE PLAYLIST_TAG SET PT_STATUS = 1 WHERE PT_INDEX = %s', IntTagID)
            else:
                break
        finally:
            hCon.commit()
            hCon.close()

        # 태그ID이용해 플레이리스트 목록 조회
        GetMelonPlayList(IntTagID, 1)

        # 태그 크롤링 완료되어 STATUS 값을 2로 변경
        hCon = MariaDBConnect()
        try:
            hCur = hCon.cursor()
            hCur.execute('UPDATE PLAYLIST_TAG SET PT_STATUS = 2 WHERE PT_INDEX = %s', IntTagID)
        finally:
            hCon.commit()
            hCon.close()

    SaveLog('[FrmGetMelonPlayList] 플레이리스트 크롤링 완료')


################################################################################################################################################################
## 멜론 크롤링
################################################################################################################################################################
################################################################################################################################################################




################################################################################################################################################################
# Main
#
if __name__ == '__main__':
    #FrmGetMelonTag()
    FrmGetMelonPlayList()
    #GetMelonPlayListMusic(1777, '441322032', '11340')
    #GetMelonPlayList(19065, 1)
    #GetMelonPlayListMusic(3701, '465683157', '907')
    #GetMelonPlayListMusic(5, '483479656', '4')
