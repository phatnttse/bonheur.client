import { Environment } from '../models/environment.model';

export const environment: Environment = {
  production: false,
  apiUrl: 'http://14.225.207.232:8080', // Local API Server url
  //apiUrl: 'https://localhost:7175', // Local API Server url
  googleClientId:
    '104087341459-cqbvghepk1r3phpp83e0h6ab0t47am98.apps.googleusercontent.com',
  ckeditorLicenseKey:
    'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3Njc5MTY3OTksImp0aSI6IjNjYzQ0YTNiLThiOTAtNGVhMS1iNjQ3LWJiODI3NmM0MTNiMyIsImxpY2Vuc2VkSG9zdHMiOlsiMTI3LjAuMC4xIiwibG9jYWxob3N0IiwiMTkyLjE2OC4qLioiLCIxMC4qLiouKiIsIjE3Mi4qLiouKiIsIioudGVzdCIsIioubG9jYWxob3N0IiwiKi5sb2NhbCJdLCJ1c2FnZUVuZHBvaW50IjoiaHR0cHM6Ly9wcm94eS1ldmVudC5ja2VkaXRvci5jb20iLCJkaXN0cmlidXRpb25DaGFubmVsIjpbImNsb3VkIiwiZHJ1cGFsIl0sImxpY2Vuc2VUeXBlIjoiZGV2ZWxvcG1lbnQiLCJmZWF0dXJlcyI6WyJEUlVQIl0sInZjIjoiZTI1YjVlODcifQ.Ru7sPQUui6morPrUP3VhsYa-bm21ytIf7g-Rod5JVNLwxQ9vFzNSQLnNCPB_MADOFvKrUqJFary_a-bhob_xew',
  mapTilerApiKey: 'nt51hF611oSmkkbYWKss',
};
