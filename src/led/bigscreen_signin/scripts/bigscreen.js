define(function(require, exports, module) {
	var Vue = require('./scripts/vue.js');
	require('./scripts/jquery.liMarquee.js');
	require('./scripts/mqttws31.min.js');
	var util = require('./scripts/util.js');
	var vueParams = require('./scripts/vueParams.js');
	var bigScreenVm = new Vue({
		el: '#bigScreenContainer',
		data: vueParams,
		beforeMount: function(){
			this.initComponent();
			this.S = jQuery.noConflict();
			this.promptContentWrapperWidth = 576 - 95;//this.S(window).width()
			this.titleWidth = 576 - 54;
			this.timerTask();
		},
		watch: {},	
		mounted: function(){
			this.time = {
				yyyymmdd: util.timeFormatYYYYMMDD(),
				week: util.weekTime(),
				HHmmss: util.timeFormatHHmmss(),
			}
			this.timeTimer = setInterval(function(){
				this.time = {
					yyyymmdd: util.timeFormatYYYYMMDD(),
					week: util.weekTime(),
					HHmmss: util.timeFormatHHmmss(),
				}	
			}.bind(this),1000);
		},
		methods: {
			init: function() {
				config.clientId = config.clientId + new Date().getTime();
				this.MQTTConnect();
				this.getWeatherInfo();
				this.getInitializationData();
				this.peopleData =  this.simulateSignData;
			},
			MQTTConnect: function() {
				var username = config.accessKey;
				var password = config.secretKey;

				this.mqttObj = new Paho.MQTT.Client(
					config.host, 
					config.port, 
					config.clientId 
				);
				var self = this;
				var options = {
					timeout: 3,
					onSuccess: self.MQTTConnectSuccess,
					onFailure: function(message) {
						console.log(message)
						setTimeout(self.MQTTconnect, self.reconnectTimeout);
					}
				};
//				this.$options = options;
				this.mqttObj.onConnectionLost = this.MQTTConnectionLost;
				this.mqttObj.onMessageArrived = this.MQTTMessageArrived;
				if(username != null) {
					options.userName = username;
					options.password = password;
					options.useSSL = config.useTLS; //如果使用HTTPS加密则配置为true
				}
				this.mqttObj.connect(options);
			},
			MQTTConnectSuccess: function(){
				// Connection succeeded; subscribe to our topic
				console.log('connect success..');
				this.mqttObj.subscribe(config.topic, {
					qos: 0
				});
				//send messgge to server
//				message = new Paho.MQTT.Message("client connected"); //set body
//				message.destinationName = config.topic; // set topic
//				this.mqttObj.send(message);
			},
			MQTTMessageArrived: function(message){
				var topic = message.destinationName;
				var payload = JSON.parse( message.payloadString );
				console.log("recv msg : " + topic + "   " + payload);
				console.log(JSON.stringify(payload,null,3));
				console.log('messgae: ',message);
				switch(payload.action){
					case 'IN':
						this.peopleSign(payload);
					  break;
					case 'OUT':
						this.peopleExit(payload);
					  break;
					case 'changeTips':
						if(this.messageCode == payload.msgCode) {
							this.tipMessage =  payload.tips;
							if(this.tipMessage.length*17 > 486) {
								if(!this.promptContentScrollIsOpeng){
									this.S('#promptContentWrapper').liMarquee({ scrollamount: this.scrollTime,hoverstop: false});
									this.promptContentScrollIsOpeng = true;
								}
							} else {
								if(this.S('#promptContentWrapper').liMarquee())this.S('#promptContentWrapper').liMarquee().liMarquee("destroy");
							};							
						};
					  break;
					case 'changeTitle':
						if(this.messageCode == payload.msgCode) {
							this.title = payload.title;
							if(this.title.length*17 > 486){
								if(!this.titleContentScrollIsOpeng) {
									this.S('#titleContent').liMarquee({ scrollamount: this.scrollTime,hoverstop: false});
									this.titleContentScrollIsOpeng = true;
								}
							} else {
								if(this.this.S('#titleContent').liMarquee())this.S('#titleContent').liMarquee().liMarquee("destroy");
							}
						}
					  break;
				}
			},
			MQTTConnectionLost: function(response){
				setTimeout(this.MQTTConnect, this.reconnectTimeout);
			},
			getInitializationData: function(){
				var msgCode = util.getQueryString("msgCode");
				console.log(msgCode);
				this.S.ajax({
					type: 'post',
					url: this.getInitDataURL,
					contentType: "application/json",
					crossDomain: true,
					data: JSON.stringify({msgCode: msgCode}),
					success: function(data){
						console.log(JSON.stringify(data, null, 3));
						if(data.status > 0) {
							// data = this.simulateData;
							this.approachPeople = data.data.approachPersonnel;
							
							this.peopleLongitudinalList = data.data.depNumbers;
							
							this.peopleListLandscape = data.data.operatorNumbers;
							
							this.peopleScrollLandscapeWidth = data.data.operatorNumbers.length * 146;
							
							this.title = data.data.title;
							
							this.tipMessage = data.data.tipMessage;
							
							this.approachpPeopleNum = data.data.totalNumber;
							
							this.messageCode = data.data.msgCode;
							
							var leaderstr = '';
							data.data.leadersList.forEach(function(d){
								leaderstr += d.userName + ',';
							});
							this.weatherData.leader = leaderstr.substring(0,leaderstr.length-1);
							
							this.gateCode = data.data.currentGateCode;
							setTimeout(this.peopleListScroll,100);	
						} else {
							alert(data.message);
						}
					}.bind(this),
					error: function(err){
						console.error(err);
					}
				});
			},
			initComponent: function(){
				Vue.component('default-dynamic',{
					template:"<div class=\"weather-wrapper\">"+
					"			<p class=\"leader\">带班领导：{{this.weather.leader}}</p>"+
					"			  <img :src=\"this.weather.icon\"/>"+
					"			  <p>{{this.weather.desc}}</p>"+
					"			  <p>{{this.weather.temp}} ℃</p>"+
					"			  <p>{{this.weather.windDeg}}风 {{this.weather.windSpeed}}级</p>"+
					"			  <p></p>"+
					"		  </div>",
					props: {
						weather: {
							type: Object,							
							default:{}
						},
					},
					data: function() {
						return {
							
						}
					},
				});
				Vue.component('people-info',{
					template: "<div class=\"people-singin\">"+
					"			<div class=\"user-icon\">"+
					"			  <img :src=\"this.people.imagUrl\"/>"+
					"			</div>"+
					"			<div class=\"user-info\">"+
					"			 <p :style='this.people.orgType == \"Proprietor\" ? \"margin-top:66px\" : \"\"'>姓名：{{this.people.userName}}</p>"+
					"			 <p>性别：{{this.people.genderCode?'男':'女'}}</p>"+
					"			 <p class='people-department-comp'>部门：{{this.people.orgName}}</p>"+
					"			 <p class='people-department-comp'>职务：{{this.people.jobTitle?this.people.jobTitle:'暂无'}}</p>"+
					"			 <p v-if='this.people.orgType !== \"Proprietor\"'>违章次数：{{this.people.peccancyNum}}次</p>"+
					"			 <p v-if='this.people.orgType !== \"Proprietor\"'>剩余积分：{{this.people.score}}</p>"+
					"			</div>"+
					"		  </div>",
					props: {
						people: {
							type: Object,							
							default:{}
						},
					},
					data: function() {
						return {
							
						}
					},
				});
			},
			getWeatherInfo: function(){
				var self = this;
				this.S.ajax({
					  type: 'get',
					  url: this.weatherURL,
					  data: {},
					  success: function(data){
						self.weatherData.icon = String.format(self.weatherIconURL,data.weather[0].icon);
						self.weatherData.temp_min = data.main.temp_min;
						self.weatherData.temp_max = data.main.temp_max;
						self.weatherData.temp = data.main.temp;
						self.weatherData.desc = data.weather[0].description;
						self.weatherData.wind = data.weather[0].description;
						self.weatherData.windDeg = self.windDegConvert(data.wind.deg);
						self.weatherData.windSpeed = data.wind.speed;
					  }
				});
			},
			timerTask: function(){
				var timerTaskFlag = true;
				this.requstDataTimer = setInterval(function () {
				  var endMo = util.mo().format('YYYY-MM-DD')+' '+ '00:00';
				  var currentMo = util.mo().format('YYYY-MM-DD HH:mm');
				  if (currentMo == endMo) {
				    if (timerTaskFlag) {
				    	this.getInitializationData();
				    	timerTaskFlag = false;
				    }
				  } else {
				    timerTaskFlag = true;
				  }
				}.bind(this),1000);
			},
			windDegConvert: function(deg){
				return this.winDegConf[Math.round((deg%360) / 45)];
			},
			peopleListScroll: function(){
				this.calcPeopleScrollLandscapeWidth();
				setTimeout(function() {
					//是否需要滚动竖向人员列表
					// this.S('#peopleScrollLongitudinal').liMarquee({ direction: 'up',scrollamount: this.scrollTime,hoverstop: false});
					if(this.peopleLongitudinalList.length > 3) {
					 	this.S('#peopleScrollLongitudinal').liMarquee({ direction: 'up',scrollamount: this.scrollTime,hoverstop: false});
						this.peopleListLongitudinalScrollIsOpen = true;
					}		
					//是否需要滚动横向人员列表		
					// this.S('#peopleScrollLandscape').liMarquee({ scrollamount: this.scrollTime,hoverstop: false});
					if(this.peopleScrollLandscapeWidth > 558) {
						this.S('#peopleScrollLandscape').liMarquee({ scrollamount: this.scrollTime,hoverstop: false});
						this.peopleListLandscapeScrollIsOpen = true;
					}
					this.S('#approachPeopleWrapper').liMarquee({ direction: 'up',scrollamount: this.scrollTime,hoverstop: false});
					if(this.tipMessage.length*17 > 486) {
						this.S('#promptContentWrapper').liMarquee({ scrollamount: this.scrollTime,hoverstop: false});
						this.promptContentScrollIsOpeng = true;
					};
					if(this.title.length*17 > 486){
						this.S('#titleContent').liMarquee({ scrollamount: this.scrollTime,hoverstop: false});
						this.titleContentScrollIsOpeng = true;
					};
				}.bind(this), 500);
			},
			//更新顶部人员列表
			updatePeopleListForLongitudinal: function(signData){
				this.S('.str_origin',this.S('#peopleScrollLongitudinal')).html(
					this.S('.str_origin',this.S('#peopleScrollLongitudinal')).html() +
					this.updateDom([{
						"orgName": this.specialPeopleConf[signData.orgType] ? this.specialPeopleConf[signData.orgType] : signData.orgName,
						"orgId": this.specialPeopleConf[signData.orgType] ? signData.orgType : signData.orgId,
						"isDom": true
					}],this.peopleListLongitudinalDom));
				this.S('#peopleScrollLongitudinal').liMarquee('update');
				this.recordNewSign.push({type:'Longitudinal',orgId:this.specialPeopleConf[signData.orgType] ? signData.orgType : signData.orgId});
				//判断是否需要滚动竖向人员数据
				if((++this.peopleLongitudinalList.length) > 3) {
				 if(!this.peopleListLongitudinalScrollIsOpen){
					this.S('#peopleScrollLongitudinal').liMarquee({ direction: 'up',scrollamount: this.scrollTime,hoverstop: false});
					this.peopleListLongitudinalScrollIsOpen = true;
				  }
				}	
			},
			//更新横向人员列表
			updatePeopleListForLandscape: function(signData){
				this.S('#peopleScrollLandscapeUL').append(
					this.updateDom([{
						"orgName": signData.orgName,
						"orgId": signData.orgId,
						"isDom": true
					}],this.peopleListLandscapeDom)
				);
				this.recordNewSign.push({type:'Landscape',orgId:signData.orgId});
				this.calcPeopleScrollLandscapeWidth();	
				this.S('#peopleScrollLandscape').liMarquee('update');

				//判断是否需要滚动横向人员数据
				if(this.peopleScrollLandscapeWidth > 558) {
					if(!this.peopleListLandscapeScrollIsOpen){
					 this.S('#peopleScrollLandscape').liMarquee({ scrollamount: this.scrollTime,hoverstop: false}); 
					 this.peopleListLandscapeScrollIsOpen = true;
					}		
				}
			},
			calcPeopleScrollLandscapeWidth: function(){
				var domWidth = 0;
				// debugger
				this.S('#peopleScrollLandscapeUL li').each(function(index,ele){
					domWidth += this.S(ele).width();
				}.bind(this));
				
				this.peopleScrollLandscapeWidth = domWidth+1;
			},
			//进场人员列表
			updateApproachPeopleList: function(signData){
				if(signData.action == 'IN'){
					//如果该人员存在并为进场时，则不进行任何操作
					var isExist = false;
					this.S("#approachPeopleWrapper li").each(function(index,ele){
						if(ele.getAttribute('approach-domid') == signData.userId) isExist = true;
					});
					if(isExist) return;
					this.S('.str_origin',this.S('#approachPeopleWrapper')).html(
						this.S('.str_origin',this.S('#approachPeopleWrapper')).html() +
						this.updateDom([{
							"orgName": signData.orgName,
							"orgId": signData.userName,
							"isDom": true
						}],this.approachPeopleDom,true,signData.userId));
				} else if(signData.action == 'OUT'){
					this.S("#approachPeopleWrapper li").each(function(index,ele){
						if(ele.getAttribute('approach-domid') == signData.userId) {
							ele.remove();
						}
					});
				}
				this.S('#approachPeopleWrapper').liMarquee('update');
			},
			peopleSign: function(signData){
				this.peopleData = signData;
				if(signData.gateCode == this.gateCode) this.showPeoplePanel();
				var isExistLongitudinal =  this.updatePeopleNumber(this.peopleLongitudinalList,
					this.specialPeopleConf[signData.orgType]?signData.orgType:signData.orgId,true,this.recordNewSign,'Longitudinal');
				/**
				 * if(!isExistLongitudinal && this.specialPeopleConf[signData.orgType]) this.updatePeopleListForLongitudinal(signData);
				 * if(!isExistLongitudinal) this.updatePeopleListForLongitudinal(signData);
				 * TODO 左上角只显示配置中的人员类型
				 */
				if(!isExistLongitudinal && this.specialPeopleConf[signData.orgType]) this.updatePeopleListForLongitudinal(signData);
				var isExistLandscape = this.updatePeopleNumber(this.peopleListLandscape,signData.orgId,true,this.recordNewSign,'Landscape');
				
				/**
				 * if(!isExistLandscape && signData.orgType == 'Operator') this.updatePeopleListForLandscape(signData);
				 * if(!isExistLandscape) this.updatePeopleListForLandscape(signData);
				 * TODO 横向滚动条只显示作业人员
				 */
				if(!isExistLandscape && signData.orgType == 'Operator') this.updatePeopleListForLandscape(signData);
				this.updateApproachPeopleList(signData);
				this.approachpPeopleNum++;
			},
			peopleExit: function(signData){
				this.peopleData = signData;
				if(signData.gateCode == this.gateCode) this.showPeoplePanel();
				this.updatePeopleNumber(this.peopleListLandscape,signData.orgId,false,this.recordNewSign,'Landscape');
				this.delSignedPeople('Landscape');
				this.updatePeopleNumber(this.peopleLongitudinalList,
					this.specialPeopleConf[signData.orgType]?signData.orgType:signData.orgId,false,this.recordNewSign,'Longitudinal');
				this.delSignedPeople('Longitudinal');
				this.approachpPeopleNum?this.approachpPeopleNum--:0;
				this.updateApproachPeopleList(signData);
			},
			delSignedPeople: function(ident){
				for(var i = 0; i<this.recordNewSign.length; i++){
					if(this.recordNewSign[i].type == ident) {
						this.recordNewSign.splice(i,1);
						break;
					}
				}
			},
			showPeoplePanel: function(){
				this.isSign = true;
				setTimeout(function(){this.isSign = false}.bind(this),this.hiddenTimer);
			},
			//更新人员签到数值
			updatePeopleNumber: function(updateArrs,orgId,flag,recordNewSignArrs,dataFlag){
				var exist = false;
				updateArrs.forEach(function(d){
					if(orgId == d.orgId){
						flag ? d.count++: (d.count?d.count--:0);
						exist = true;
					}
				}.bind(this));
				//DOM追加方式修改
				if(recordNewSignArrs && recordNewSignArrs.length > 0){
					recordNewSignArrs.forEach(function(d){
						if(orgId == d.orgId && dataFlag == d.type){
							var dom = this.S('[data-dom=isDomEle'+ d.type + orgId +']').eq(0);
							flag ? dom.text(Number(dom.text())+1): dom.text((Number(dom.text())?(Number(dom.text())-1) : 0));
						}
					}.bind(this));
				}
				return exist || this.recordNewSign.filter(function(d){return d.type == dataFlag  && d.orgId == orgId}).length;
			},
			//替换DOM中的数据
			updateDom: function(data,doms,flag,uid){
				var domStr = "";
				data.forEach(function(d){
					domStr += String.format(doms,d.orgName,d.orgId,flag?uid:1);
				});
				return domStr;
			},
			simulateCall: function(){}
		}
	});

	bigScreenVm.init();
});