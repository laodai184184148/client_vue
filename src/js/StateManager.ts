// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import * as faceapi from "@vladmandic/face-api";

import { ChallengeDetails } from "@/js/RemoteStarter.ts";
import { DrawOptions } from "@/js/Drawer.ts";
import { FaceState } from "@/js/States.ts";
import { FailState } from "@/js/States.ts";
import { FaceLeftState } from "@/js/States.ts";
import { FaceRightState } from "@/js/States.ts";
import { FaceCenterState } from "@/js/States.ts";
import { State } from "@/js/States.ts";
import { StateOutput } from "@/js/States.ts";
import { SuccessState } from "@/js/States.ts";

export interface StateManagerOutput {
  readonly end: boolean;
  readonly success?: boolean;
  readonly shouldSaveFrame: boolean;
  readonly drawOptions?: DrawOptions;
  readonly helpMessage?: string;
  readonly helpAnimationNumber?: number;
}

export class StateManager {
  private readonly stateTask:string;
  private readonly challengeDetails: ChallengeDetails;

  private currentState!: State;
  private endTime!: number;

  constructor(stateTask:string,challengeDetails: ChallengeDetails) {
    this.stateTask=stateTask;
    this.challengeDetails = challengeDetails;
    //State 1:face
    this.changeCurrentState(new FaceState(this.stateTask,this.challengeDetails));
  }

  process(
    result: faceapi.WithFaceLandmarks<{ detection: faceapi.FaceDetection }, faceapi.FaceLandmarks68>[]
  ): StateManagerOutput {
    
    // Time out change state to fail
    if (this.endTime > 0 && Date.now() / 1000 > this.endTime) {
      this.changeCurrentState(new FailState(this.stateTask,this.challengeDetails));
    }
    const stateOutput: StateOutput = this.currentState.process(result);
    if (stateOutput.nextState) {
      this.changeCurrentState(stateOutput.nextState);
    }
    let end = false;
    let shouldSaveFrame = false;
    let success;
    console.log(this.currentState.getName());
   
    if (this.currentState.getName() === SuccessState.NAME) {
      end = false;
      success = false;
      shouldSaveFrame = true;
    } 
     if (this.currentState.getName() === FailState.NAME) {
      end = false;
      success = false;
    }
    else if (this.currentState.getName() === FaceLeftState.NAME) {
      shouldSaveFrame = false;
    }
    else if (this.currentState.getName() === FaceRightState.NAME) {
      shouldSaveFrame = true;
    }
    else if (this.currentState.getName() === FaceCenterState.NAME) {
      shouldSaveFrame = true;
    }

    if (this.currentState.getName()==="SuccessState") {
      end = false;
      success = false;
      shouldSaveFrame = true;
      if (this.stateTask==="turn-face-left"){
      this.changeCurrentState(new FaceLeftState(this.stateTask,this.challengeDetails));
      } else 
      if (this.stateTask==="turn-face-right"){
        this.changeCurrentState(new FaceRightState(this.stateTask,this.challengeDetails));
      } else if (this.stateTask==="keep-face-ahead"){
        this.changeCurrentState(new FaceCenterState(this.stateTask,this.challengeDetails));
      }
    }
    if (this.currentState.getName()==="FailState") {
      if (this.stateTask==="turn-face-left"){
        this.changeCurrentState(new FaceLeftState(this.stateTask,this.challengeDetails));
        } else 
        if (this.stateTask==="turn-face-right"){
          this.changeCurrentState(new FaceRightState(this.stateTask,this.challengeDetails));
        } else if (this.stateTask==="keep-face-ahead"){
          this.changeCurrentState(new FaceCenterState(this.stateTask,this.challengeDetails));
        }
      end = false;
      success = false;
    }
    
    return {
      end: end,
      success: success,
      shouldSaveFrame: shouldSaveFrame,
      drawOptions: stateOutput.drawOptions,
      helpMessage: stateOutput.helpMessage,
      helpAnimationNumber: stateOutput.helpAnimationNumber
    };
  }

  private changeCurrentState(state: State) {
    if (this.currentState !== state) {
      this.currentState = state;
      this.endTime =
        state.getMaximumDurationInSeconds() != -1 ? Date.now() / 800 + state.getMaximumDurationInSeconds() : -1;
    }
  }
}
