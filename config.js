module.exports = {
	'httpsPort': process.env.PORT || 443,
	'httpPort': process.env.PORT || 80,
	'database': 'mongodb://172.24.42.57:27017/myDataBase',
	//'database': 'mongodb://ajapapi:5enarquisoft@ds149144.mlab.com:49144/mina_samaca_g4',
	'secret': 'ilovescotchscotchyscotchscotch',
	'pkey': './data/privateKey.key',
	'certi': './data/certificate.crt'
};
