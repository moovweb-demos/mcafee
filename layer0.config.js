module.exports = {
  routes: './src/routes.ts',
  connector: '@layer0/starter',
  backends: {
    origin: {
      domainOrIp: 'www.mcafee.com',
      hostHeader: 'www.mcafee.com',
    },
  },
}
