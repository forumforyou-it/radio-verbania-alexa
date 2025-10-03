const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

app.post('/', (request, response) => {
  const requestType = request.body.request.type;
  
  let alexaResponse;
  
  if (requestType === 'LaunchRequest') {
    alexaResponse = {
      version: '1.0',
      response: {
        outputSpeech: {
          type: 'PlainText',
          text: 'Benvenuto su Radio Verbania. Sto avviando lo streaming.'
        },
        directives: [
          {
            type: 'AudioPlayer.Play',
            playBehavior: 'REPLACE_ALL',
            audioItem: {
              stream: {
                token: 'radioVerbania',
                url: 'https://stream.zeno.fm/a1usb5hslvgvv',
                offsetInMilliseconds: 0
              }
            }
          }
        ],
        shouldEndSession: true
      }
    };
  } else if (requestType === 'IntentRequest') {
    const intentName = request.body.request.intent.name;
    
    if (intentName === 'AMAZON.ResumeIntent') {
      alexaResponse = {
        version: '1.0',
        response: {
          directives: [
            {
              type: 'AudioPlayer.Play',
              playBehavior: 'REPLACE_ALL',
              audioItem: {
                stream: {
                  token: 'radioVerbania',
                  url: 'https://stream.zeno.fm/a1usb5hslvgvv',
                  offsetInMilliseconds: 0
                }
              }
            }
          ],
          shouldEndSession: true
        }
      };
    } else if (intentName === 'AMAZON.PauseIntent' || intentName === 'AMAZON.StopIntent') {
      alexaResponse = {
        version: '1.0',
        response: {
          directives: [
            {
              type: 'AudioPlayer.Stop'
            }
          ],
          shouldEndSession: true
        }
      };
    }
  } else if (requestType === 'AudioPlayer.PlaybackStarted' || 
             requestType === 'AudioPlayer.PlaybackFinished' ||
             requestType === 'AudioPlayer.PlaybackStopped' ||
             requestType === 'AudioPlayer.PlaybackNearlyFinished' ||
             requestType === 'AudioPlayer.PlaybackFailed') {
    alexaResponse = {
      version: '1.0',
      response: {
        shouldEndSession: true
      }
    };
  }
  
  response.json(alexaResponse);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log('Server in ascolto sulla porta ' + PORT);
});
