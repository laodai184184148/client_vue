/* eslint-disable @typescript-eslint/camelcase */
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import axios from "axios";
import { Utils } from "@/js/Utils.ts";

interface StartRequestData {
  readonly externalPersonId: string;
  readonly imageWidth: number;
  readonly imageHeight: number;
}
// interface StartRequestData {
//   readonly external_person_id: string;
//   readonly image_width: number;
//   readonly image_height: number;
// }

export interface ChallengeDetails {
  areaHeight: number,
  areaLeft: number,
  areaTop: number,
  areaWidth: number,
  external_person_id: number,
  id: string,
  imageHeight: number,
  imageWidth: number,
  minFaceAreaPercent: number,
  taskOrder: {
    "keep-face-ahead": number,
    "turn-face-left": number,
    "turn-face-right": number
}}


export class RemoteStarter {
  static startChallenge(
    successCallback: (challengeDetails: ChallengeDetails) => void,
    errorCallback: (error: Error) => void
  ): void {
    const url: string = Utils.getConfig().API_URL + Utils.getConfig().API_START_ENDPOINT;
    const startRequestData: StartRequestData = {
      externalPersonId: Utils.getUserId(),
      imageWidth: Utils.getMediaStreamInfo().actualWidth,
      imageHeight: Utils.getMediaStreamInfo().actualHeight
    };
    // const startRequestData: StartRequestData = {
    //   external_person_id: Utils.getUserId(),
    //   image_width: Utils.getMediaStreamInfo().actualWidth,
    //   image_height: Utils.getMediaStreamInfo().actualHeight
    //   };
    Object.keys(startRequestData).forEach(key => {
      const newKey = Utils.convertToSnakeCase(key);
      if (newKey !== key) {
        (startRequestData as any)[newKey] = (startRequestData as any)[key];
        delete (startRequestData as any)[key];
      }
    });
    console.log('Request S1:',startRequestData);
    axios
      .post(url, startRequestData, {
        auth: {
          username: Utils.getConfig().ORG_ID,
          password: Utils.getConfig().ORG_API_KEY
        }
          
      })
      .then(function(response: any) {
        console.log('Response S1:',response.data);
        console.log(url);
        
        const challengeDetails: ChallengeDetails = response.data;
        
        Object.keys(challengeDetails).forEach(key => {
          const newKey = Utils.convertToCamel(key);
          if (newKey !== key) {
            (challengeDetails as any)[newKey] = (challengeDetails as any)[key];
            delete (challengeDetails as any)[key];
          }
        });
        console.log(challengeDetails);
        console.log(challengeDetails.taskOrder["keep-face-ahead"]);
        
        successCallback(challengeDetails);
      })
      .catch(function(error: any) {
        errorCallback(error);
      });
    }
}
