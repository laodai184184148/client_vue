// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import * as faceapi from "@vladmandic/face-api";
import Logger from "js-logger";
import { ChallengeDetails } from "@/js/RemoteStarter.ts";
import { Drawer, DrawOptions } from "@/js/Drawer.ts";
import { Utils } from "@/js/Utils.ts";

export interface StateOutput {
  readonly nextState?: State;
  readonly drawOptions?: DrawOptions;
  readonly helpMessage?: string;
  readonly helpAnimationNumber?: number;
}

export abstract class State {
  constructor(readonly stateTask: string, readonly challengeDetails: ChallengeDetails) { }

  process(

    // eslint-disable-next-line
    _faces: faceapi.WithFaceLandmarks<{ detection: faceapi.FaceDetection }, faceapi.FaceLandmarks68>[]
  ): StateOutput {
    return {};
  }

  getMaximumDurationInSeconds(): number {
    return -1;
  }

  protected isFaceBoxInsideFaceArea(faceBox: faceapi.Box, addTolerance = true) {
    const tolerance: number = addTolerance ? parseInt(Utils.getConfig().FACE_AREA_TOLERANCE_PERCENT) / 100 : 0;
    return (
      faceBox.x >= this.challengeDetails.areaLeft * (1 - tolerance) &&
      faceBox.y >= this.challengeDetails.areaTop * (1 - tolerance) &&
      faceBox.x + faceBox.width <= this.challengeDetails.areaLeft + this.challengeDetails.areaWidth * (1 + tolerance) &&
      faceBox.y + faceBox.height <= this.challengeDetails.areaTop + this.challengeDetails.areaHeight * (1 + tolerance)
    );
  }


  abstract getName(): string;
}

export class FailState extends State {
  static NAME = "FailState";
  getName(): string {
    return FailState.NAME;
  }
}

export class SuccessState extends State {
  static NAME = "SuccessState";

  getName(): string {
    return SuccessState.NAME;
  }
}

export class FaceLeftState extends State {
  static NAME = "FaceLeftState";

  private framesWithoutFace = 0;
  private landmarkIndex = parseInt(Utils.getConfig().LANDMARK_INDEX);

  process(
    faces: faceapi.WithFaceLandmarks<{ detection: faceapi.FaceDetection }, faceapi.FaceLandmarks68>[]
  ): StateOutput {
    let nextState: State = this;
    if (faces.length === 1) {
      console.log(faces[0].angle.roll);
      
      if (faces[0].angle.roll !== undefined)
        if (faces[0].angle.roll < 0) {
          nextState = new SuccessState(this.stateTask, this.challengeDetails);
        }
        else nextState = new FailState(this.stateTask, this.challengeDetails);
    } else {
      if (
        faces.length !== 0 ||
        ++this.framesWithoutFace > parseInt(Utils.getConfig().STATE_NOSE_MAX_FRAMES_WITHOUT_FACE)
      ) {
        Logger.info(`NoseState fail: #faces=${faces.length} framesWithoutFace=${this.framesWithoutFace}`);
        nextState = new FailState(this.stateTask, this.challengeDetails);
      } else {
        Logger.debug(`no face detected. Skipping frame...`);
      }
    }
    
    
    const drawOptions: DrawOptions = {
      faceDrawBoxOptions: {
        boxColor: Drawer.COLOR_GREEN
      },
      noseDrawBoxOptions: {
        boxColor: Drawer.COLOR_RED
      }
    };
    return {
      nextState: nextState,
      drawOptions: drawOptions,
      helpMessage: "Turn your face to left side",
      helpAnimationNumber: 2
    };
  }

  getMaximumDurationInSeconds(): number {
    return parseInt(Utils.getConfig().STATE_NOSE_DURATION_IN_SECONDS);
  }

  getName(): string {
    return FaceLeftState.NAME;
  }
}
export class FaceRightState extends State {
  static NAME = "FaceRightState";

  private framesWithoutFace = 0;
  private landmarkIndex = parseInt(Utils.getConfig().LANDMARK_INDEX);

  process(
    faces: faceapi.WithFaceLandmarks<{ detection: faceapi.FaceDetection }, faceapi.FaceLandmarks68>[]
  ): StateOutput {
    let nextState: State = this;

    if (faces.length === 1) {
      if (faces[0].angle.roll !== undefined)
        if (faces[0].angle.roll >0.01) {
          nextState = new SuccessState(this.stateTask, this.challengeDetails);
        }
        else nextState = new FailState(this.stateTask, this.challengeDetails);
    } else {
      if (
        faces.length !== 0 ||
        ++this.framesWithoutFace > parseInt(Utils.getConfig().STATE_NOSE_MAX_FRAMES_WITHOUT_FACE)
      ) {
        Logger.info(`NoseState fail: #faces=${faces.length} framesWithoutFace=${this.framesWithoutFace}`);
        nextState = new FailState(this.stateTask, this.challengeDetails);
      } else {
        Logger.debug(`no face detected. Skipping frame...`);
      }
    }
    const drawOptions: DrawOptions = {
      faceDrawBoxOptions: {
        boxColor: Drawer.COLOR_GREEN
      },
      noseDrawBoxOptions: {
        boxColor: Drawer.COLOR_YELLOW
      }
    };
    return {
      nextState: nextState,
      drawOptions: drawOptions,
      helpMessage: "Turn your face to Right side",
      helpAnimationNumber: 2
    };
  }

  getMaximumDurationInSeconds(): number {
    return parseInt(Utils.getConfig().STATE_NOSE_DURATION_IN_SECONDS);
  }

  getName(): string {
    return FaceRightState.NAME;
  }
}
export class FaceCenterState extends State {
  static NAME = "FaceCenterState";

  private framesWithoutFace = 0;
  private landmarkIndex = parseInt(Utils.getConfig().LANDMARK_INDEX);

  process(
    faces: faceapi.WithFaceLandmarks<{ detection: faceapi.FaceDetection }, faceapi.FaceLandmarks68>[]
  ): StateOutput {
    let nextState: State = this;
    if (faces.length === 1) {
      if (faces[0].angle.roll !== undefined)
        if ((faces[0].angle.roll >0)&&(faces[0].angle.roll <0.1)) {
          nextState = new SuccessState(this.stateTask, this.challengeDetails);
        }
        else nextState = new FailState(this.stateTask, this.challengeDetails);

    } else {
      if (
        faces.length !== 0 ||
        ++this.framesWithoutFace > parseInt(Utils.getConfig().STATE_NOSE_MAX_FRAMES_WITHOUT_FACE)
      ) {
        Logger.info(`NoseState fail: #faces=${faces.length} framesWithoutFace=${this.framesWithoutFace}`);
        nextState = new FailState(this.stateTask, this.challengeDetails);
      } else {
        Logger.debug(`no face detected. Skipping frame...`);
      }
    }
    const drawOptions: DrawOptions = {
      faceDrawBoxOptions: {
        boxColor: Drawer.COLOR_GREEN
      },
      noseDrawBoxOptions: {
        boxColor: Drawer.COLOR_YELLOW
      }
    };
    return {
      nextState: nextState,
      drawOptions: drawOptions,
      helpMessage: "Keep your face ahead",
      helpAnimationNumber: 2
    };
  }

  getMaximumDurationInSeconds(): number {
    return parseInt(Utils.getConfig().STATE_NOSE_DURATION_IN_SECONDS);
  }

  getName(): string {
    return FaceCenterState.NAME;
  }
}
export class AreaState extends State {
  static NAME = "AreaState";

  private framesWithoutFace = 0;

  process(
    faces: faceapi.WithFaceLandmarks<{ detection: faceapi.FaceDetection }, faceapi.FaceLandmarks68>[]
  ): StateOutput {
    let nextState: State = this;
    let boxColor = Drawer.COLOR_RED;
    if (faces.length === 1) {
      if (this.isFaceBoxInsideFaceArea(faces[0].detection.box, false)) {
        boxColor = Drawer.COLOR_GREEN;
        if (this.stateTask === "turn-face-left") {
          nextState = new FaceLeftState(this.stateTask, this.challengeDetails);
        } else if (this.stateTask === "turn-face-right") {
          nextState = new FaceRightState(this.stateTask, this.challengeDetails);
        } else {
          if (this.stateTask === "keep-face-ahead")
            nextState = new FaceCenterState(this.stateTask, this.challengeDetails);
        }

      }
    } else {
      if (
        faces.length !== 0 ||
        ++this.framesWithoutFace > parseInt(Utils.getConfig().STATE_AREA_MAX_FRAMES_WITHOUT_FACE)
      ) {
        Logger.info(`AreaState fail: #faces=${faces.length} framesWithoutFace=${this.framesWithoutFace}`);
        nextState = new FailState(this.stateTask, this.challengeDetails);
      } else {
        Logger.debug(`no face detected. Skipping frame...`);
      }
    }
    const drawOptions: DrawOptions = {
      faceDrawBoxOptions: {
        boxColor: boxColor
      }
    };
    return {
      nextState: nextState,
      drawOptions: drawOptions,
      helpMessage: "Center your face inside the area",
      helpAnimationNumber: 1
    };
  }

  getMaximumDurationInSeconds(): number {
    return parseInt(Utils.getConfig().STATE_AREA_DURATION_IN_SECONDS);
  }

  getName(): string {
    return AreaState.NAME;
  }
}

export class FaceState extends State {
  static NAME = "FaceState";

  process(
    faces: faceapi.WithFaceLandmarks<{ detection: faceapi.FaceDetection }, faceapi.FaceLandmarks68>[]
  ): StateOutput {
    let nextState: State = this;
    let helpMessage = undefined;
    switch (faces.length) {
      case 0:
        helpMessage = "No face detected. Look at the camera.";
        break;
      case 1:
        nextState = new AreaState(this.stateTask, this.challengeDetails);
        break;
      default:
        helpMessage = "More than one face detected. Should be one.";
    }
    const drawOptions: DrawOptions = {
      faceDrawBoxOptions: {
        boxColor: Drawer.COLOR_RED
      }
    };
    return {
      nextState: nextState,
      drawOptions: drawOptions,
      helpMessage: helpMessage
    };
  }

  getName(): string {
    return FaceState.NAME;
  }
}
