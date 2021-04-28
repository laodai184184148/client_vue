import axios from "axios";
import { Utils } from "@/js/Utils.ts";

interface FramesRequestData {
  readonly timestamp: number;
  readonly photo: string;
  readonly task: string;
  
}

interface FramesResponseData {
  readonly message: string;
}

interface VerifyResponseData {
  readonly success: boolean;
}

export class RemoteVerifier {
  private readonly challengeId: string;
  // private readonly task: string;
  private readonly videoElement: HTMLVideoElement;
  private readonly promises: Promise<any>[];
  private readonly invisibleCanvas: HTMLCanvasElement;

  constructor(challengeId: string, videoElement: HTMLVideoElement) {
  // constructor(challengeId: string, token: string,task: string , videoElement: HTMLVideoElement) {
    this.challengeId = challengeId;
    this.videoElement = videoElement;
    this.promises = [];

    // Create canvas to convert video frames to blob
    this.invisibleCanvas = document.createElement("canvas");
    this.invisibleCanvas.width = this.videoElement.width;
    this.invisibleCanvas.height = this.videoElement.height;
  }

  uploadFrame(challengeTask:string) {
    const context = this.invisibleCanvas.getContext("2d");
    if (context === null) {
      throw "Error getting canvas context";
    }
    context.drawImage(this.videoElement, 0, 0, this.videoElement.width, this.videoElement.height);

    if (Utils.getConfigBooleanValue("FLIP_VIDEO")) {
      context.scale(-1, 1);
    }

    const canvas = this.invisibleCanvas;
    const self = this;
    this.promises.push(
      // @ts-ignore
      new Promise(function(resolve: () => void, reject: (error: Error) => void) {
        canvas.toBlob(
          function(blob) {
            if (blob === null) {
              reject(new Error("Error creating blob from canvas"));
            } else {
              RemoteVerifier.callFramesApi(challengeTask,self.challengeId, blob, resolve, reject);
            }
          },
          "image/jpeg",
          parseFloat(Utils.getConfig().IMAGE_JPG_QUALITY)
        );
      })
    );
  }
//Step 2 save and check frame 
  static callFramesApi(
    challengeTask:string,
    challengeId: string,
    blob: Blob,
    resolve: () => void,
    reject: (error: Error) => void
  ) {
    const reader: FileReader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = function() {
      const framesEndpoint: string = Utils.getConfig().API_FRAMES_ENDPOINT_PATTERN.replace(
        "{challenge_id}",
        challengeId
      );
      const url: string = Utils.getConfig().API_URL + framesEndpoint;

      const dataUrl = reader.result as string;
      const requestData: FramesRequestData = {
        timestamp: Date.now(),
        // photo: dataUrl.substr(dataUrl.indexOf(",") + 1),
        photo: dataUrl.substr(dataUrl.indexOf(",") + 1),
        task: challengeTask
      };
      //console.log('Request S2:',requestData);
      
      const promise = axios.put(url, requestData, {
        auth: {
          username: Utils.getConfig().ORG_ID,
          password: Utils.getConfig().ORG_API_KEY
        }
      });
      promise
        .then(function(response:any) {
          console.log('Response S2',response);
          
          resolve();
        })
        .catch(function(error: any) {
          reject(error);
        });
    };
  }

  verify(successCallback: (result: boolean) => void, errorCallback: (error: Error) => void): void {
    const self = this;
    Promise.all(this.promises).then(function() {
      self.callVerificationApi(successCallback, errorCallback);
    });
  }
  //Step 3 :Verfiry Challenge
  private callVerificationApi(
    successCallback: (result: boolean) => void,
    errorCallback: (error: Error) => void
  ): void {
    console.log("Step 3");
    
    const verifyEndpoint: string = Utils.getConfig().API_VERIFY_ENDPOINT_PATTERN.replace(
      "{challenge_id}",
      this.challengeId
    );
    const url: string = Utils.getConfig().API_URL + verifyEndpoint;
    console.log(url);
    
    const promise = axios.post(url, {
      auth: {
        username: Utils.getConfig().ORG_ID,
        password: Utils.getConfig().ORG_API_KEY
      }
    });
    promise
      .then(function(response: any) {
        console.log(response);
        
        const verifyResponseData: VerifyResponseData = response.data;
        successCallback(verifyResponseData.success);
      })
      .catch(function(error: any) {
        errorCallback(error);
      });
  }
}
