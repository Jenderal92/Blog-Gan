document.getElementById('urlForm').addEventListener('submit', function (event) {
  event.preventDefault();
  const jsonInput = document.getElementById('jsonInput').value;
  const urlInput = document.getElementById('urlInput').value;

  fetchCredentials(jsonInput)
    .then(credentials => {
      const scopedCredentials = credentials.withScopes(['https://www.googleapis.com/auth/indexing']);
      const indexingService = buildIndexingService(scopedCredentials);

      const urlNotification = {
        'url': urlInput,
        'type': 'URL_UPDATED'
      };

      sendUrlNotification(indexingService, urlNotification)
        .then(response => {
          console.log(response);
          alert('URL successfully submitted!');
          document.getElementById('urlInput').value = '';
        })
        .catch(error => {
          console.error(error);
        });
    })
    .catch(error => {
      console.error(error);
    });
});

function fetchCredentials(jsonPath) {
  return fetch(jsonPath)
    .then(response => response.json())
    .then(credentials => {
      const clientEmail = credentials.client_email;
      const privateKey = credentials.private_key;

      const authOptions = {
        'credentials': {
          'client_email': clientEmail,
          'private_key': privateKey
        },
        'scopes': ['https://www.googleapis.com/auth/indexing']
      };

      return google.auth.getClient(authOptions);
    });
}

function buildIndexingService(credentials) {
  const discoveryUrl = 'https://indexing.googleapis.com/$discovery/rest?version=v3';

  return google.discoverAPI(discoveryUrl)
    .then(indexing => {
      return indexing;
    });
}

function sendUrlNotification(indexingService, urlNotification) {
  return indexingService.urlNotifications.publish({
    'body': urlNotification
  });
}
