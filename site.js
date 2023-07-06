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
      const scopes = ['https://www.googleapis.com/auth/indexing'];

      return new google.auth.ServiceAccountAuth(clientEmail, {
        'privateKey': privateKey,
        'scopes': scopes
      });
    });
}

function buildIndexingService(credentials) {
  return new Promise((resolve, reject) => {
    const discoveryUrl = 'https://indexing.googleapis.com/$discovery/rest?version=v3';

    google.apis.discover('indexing', 'v3', discoveryUrl)
      .then(indexing => {
        indexing.client.setCredentials(credentials);
        resolve(indexing);
      })
      .catch(error => {
        reject(error);
      });
  });
}

function sendUrlNotification(indexingService, urlNotification) {
  return new Promise((resolve, reject) => {
    indexingService.urlNotifications.publish({
      'body': urlNotification
    })
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
}
