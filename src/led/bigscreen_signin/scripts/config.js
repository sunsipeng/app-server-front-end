define(function(require, exports, module) {
	module.exports = {
		host: 'mqtt-cn-mp909uxk601.mqtt.aliyuncs.com',
		port: 80,
		topic: 'TOPIC_BIMS_BK_BRIDGE/getuser', //push： TOPIC_BIMS_BK_BRIDGE/getuser ; sence:TOPIC_BIMS_BK_BRIDGE/gateuser_topic
		useTLS: false,
		accessKey: '1EnmcLpwlMKBfeEX',
		secretKey: 't1vt/vznYKYF+OV4zOh6xjyZWAQ=',
		cleansession: true,
		groupId: 'GID_BIMS_BK_BRIDGE_GROUP',
		clientId: 'GID_BIMS_BK_BRIDGE_GROUP@@@',
		interfaceHost: "http://bim001.320.io/beikou",//dev
		// interfaceHost: "http://10.1.1.209:8083/Beikou",//pro
		// interfaceHost:"http://beikou.bim001.cn/beikou",
		simulateData: {
			"status": 1,
			"data": {
			   "title": "中交二航局土建3标项目经理部",
			   "totalNumber": 0,
			   "msgCode": "TJ03-GQ04-01-MSG01",
			   "depNumbers": [
				  {
					 "orgName": "其他",
					 "count": 0,
					 "orgId": "Other"
				  }
			   ],
			   "operatorNumbers": [],
			   "approachPersonnel": [],
			   "leadersList": [
				  {
					 "userId": 12,
					 "orgName": null,
					 "orgId": null,
					 "userName": "薛温瑞",
					 "genderCode": 0,
					 "jobTitle": null,
					 "peccancyNum": 0,
					 "score": 0,
					 "imagUrl": null,
					 "action": null,
					 "gateCode": null,
					 "orgType": null
				  },
				  {
					 "userId": 13,
					 "orgName": null,
					 "orgId": null,
					 "userName": "潘济",
					 "genderCode": 0,
					 "jobTitle": null,
					 "peccancyNum": 0,
					 "score": 0,
					 "imagUrl": null,
					 "action": null,
					 "gateCode": null,
					 "orgType": null
				  }
			   ],
			   "tipMessage": "近日高温，注意防暑！近日高温，注意防暑！近日高温，注意防暑！近日高温，注意防暑！",
			   "currentGateCode": "TJ01-GQ01"
			},
			"message": null
		 }
	};
});