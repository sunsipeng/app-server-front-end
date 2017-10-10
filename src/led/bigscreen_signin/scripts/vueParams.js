define(function(require, exports, module) {
    module.exports = {
        title: "",
        tipMessage:"",
        approachpPeopleNum:0,
        reconnectTimeout:2000,
        mqttObj: null,
        $options:null,
        peopleLongitudinalList:[],
        peopleListLandscape:[],
        approachPeople:[],
        timer:500,
        peopleListHeight:25,
        peopleListScrollTimer:null,
        S:null,
        peopleListLongitudinalDom: "<li class='people-scroll-li'>"+
        "	<div class='people-items'>"+
        "		<span class='people-orgName'>{0}：</span><span class='people-value' data-dom='isDomEleLongitudinal{1}'>{2}</span> "+
        "		<span class='img-area'>"+
        "		<img src='images/people.png'></span>"+
        "		</div>"+
        "	</li>",
        peopleListLandscapeDom:"<li class='people-statistics-b-li'>"+
        "  <div class='people-items'><span class='people-orgName'>{0}：</span>"+
        "    <span class='people-value' data-dom='isDomEleLandscape{1}'>{2}</span>"+
        "    <span class='img-area'>"+
        "      <img src='images/people-fff.png'></span>"+
        "  </div>"+
        "</li>",
        approachPeopleDom:"<li class='approach-people-b-li' approach-domId='{2}'>"+
        "  <div class='items'>{0}</div>"+
        "  <div class='items'>{1}</div></li>",
        scrollTime:10,
        peopleScrollLandscapeWidth:0,
        promptContentWrapperWidth:0,
        time : {
            yyyymmdd:"",
            week:"",
            HHmmss:""
        },
        timeTimer:null,
        peopleData:{},
        weatherData:{
            icon:"",
            temp:0,
            desc:"",
            temp_min:0,
            temp_max:0,
            wind:"",
            windDeg:"",
            windSpeed:"",
            leader:"chancy"
        },
        isSign:false,
        weatherURL:"http://api.openweathermap.org/data/2.5/weather?appid=fe836a0e77d6a422617df27e259c667d&q=wenzhou&units=metric&lang=zh_cn",
        getInitDataURL: config.interfaceHost + "/rest/gatemsg/initGateMessage.jo",
        weatherIconURL: 'http://openweathermap.org/img/w/{0}.png',
        winDegConf:["北","东北","东","东南","南","西南","西","西北"],
        simulateData: config.simulateData,
        simulateSignData:{
            "userId": 238,
            "orgName": "一号拌合站",
            "orgId": "79",
            "userName": "邹野58",
            "genderCode": 1,
            "jobTitle": null,
            "peccancyNum": 0,
            "score": 12,
            "imagUrl": "http://bim001.320.io/beikou/files/201706/27/183703_484_937.jpg",
            "action": "IN",
            "gateCode": "TJ01-GQ01",
            "orgType": "Other"
        },
        gateCode:'',
        hiddenTimer: 100e3,
        recordNewSign:[],
        messageCode:"",
        timerFlag: true,
        specialPeopleConf:{
            'Proprietor':'业主',
            'Supervisor':'监理',
            'ProDep':'项目部',
            'Operator':'作业人员',
            'Other':'其他'
        },
        //,'Other':'其他'
        requstDataTimer:null,
        titleWidth:0,
        promptContentScrollIsOpeng:false,
        titleContentScrollIsOpeng:false,
        peopleListLandscapeScrollIsOpen:false,
        peopleListLongitudinalScrollIsOpen:false,
    };
});