// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import * as faceapi from "@vladmandic/face-api";
import { ChallengeDetails } from "@/js/RemoteStarter.ts";

export interface DrawBoxOptions {
  readonly boxColor?: string;
  readonly lineWidth?: number;
}

export interface DrawOptions {
  readonly faceDrawBoxOptions?: DrawBoxOptions;
  readonly noseDrawBoxOptions?: DrawBoxOptions;
}

export class Drawer {
  public static COLOR_RED = "rgba(255, 0, 0, 1)";
  public static COLOR_GREEN = "rgba(0, 255, 0, 1)";
  public static COLOR_YELLOW = "rgba(255, 255, 0, 1)";

  private challengeDetails: ChallengeDetails;
  private readonly canvasElement: HTMLCanvasElement;

  constructor(challengeDetails: ChallengeDetails, canvasElement: HTMLCanvasElement) {
    this.challengeDetails = challengeDetails;
    this.canvasElement = canvasElement;
  }
   drawing() {
    const ctx = this.canvasElement.getContext("2d")
    const img = new Image();
    img.onload = function() {
      if(ctx)
          ctx.drawImage(img,500,500, 500, 500);
    };
    img.src = 'https://mdn.mozillademos.org/files/5397/rhino.jpg';
  }
  drawFaceLine(title: string, challengeTask: string) {
    const ctx = this.canvasElement.getContext("2d");

    function myFunction(x1: number, y1: number, x2: number, y2: number) {
      if (ctx) {

        if (title === "fail")
          ctx.strokeStyle = Drawer.COLOR_RED;
        else ctx.strokeStyle = Drawer.COLOR_GREEN;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      return 0;
    }
    const landMarkPoint = [
      {
        "_x": 225.07488159846665,
        "_y": 274.8502817250885
      },
      {
        "_x": 231.10280723881127,
        "_y": 314.23107395545617
      },
      {
        "_x": 239.75902061175705,
        "_y": 348.73116577641144
      },
      {
        "_x": 252.5844798238218,
        "_y": 380.8744394280113
      },
      {
        "_x": 273.49209721397756,
        "_y": 413.295758912722
      },
      {
        "_x": 306.73622252058385,
        "_y": 434.7427826620735
      },
      {
        "_x": 346.67613436293004,
        "_y": 449.2793657876648
      },
      {
        "_x": 389.1162790210187,
        "_y": 460.4931613303818
      },
      {
        "_x": 426.53411878656743,
        "_y": 466.15306223408356
      },
      {
        "_x": 452.52781189989446,
        "_y": 452.52641315237656
      },
      {
        "_x": 457.0084673316419,
        "_y": 437.60512078777924
      },
      {
        "_x": 460.94720019411443,
        "_y": 420.3479542829193
      },
      {
        "_x": 464.4496752173841,
        "_y": 391.767418632666
      },
      {
        "_x": 475.0387314708173,
        "_y": 358.9222242929138
      },
      {
        "_x": 481.76371707033513,
        "_y": 329.99212707058564
      },
      {
        "_x": 480.9395133407056,
        "_y": 302.1492699779667
      },
      {
        "_x": 470.7067412288129,
        "_y": 267.6381851233639
      },
      {
        "_x": 481.82123936724065,
        "_y": 224.26773841158524
      }
      ,
      {
        "_x": 475.82123936724065,
        "_y": 200.26773841158524
      }
      ,
      {
        "_x": 469.82123936724065,
        "_y": 180.26773841158524
      }
      ,
      {
        "_x": 460.82123936724065,
        "_y": 160.26773841158524
      },
      {
        "_x": 440.82123936724065,
        "_y": 150.26773841158524
      }
      ,
      {
        "_x": 350.82123936724065,
        "_y": 150.26773841158524
      }
      ,
      {
        "_x": 310.82123936724065,
        "_y": 175.26773841158524
      }
      ,
      {
        "_x": 290.82123936724065,
        "_y": 190.26773841158524
      },
      {
        "_x": 250.82123936724065,
        "_y": 200.26773841158524
      }
      ,
      {
        "_x": 230.82123936724065,
        "_y": 230.26773841158524
      },
      {
        "_x": 225.07488159846665,
        "_y": 274.8502817250885
      }
    ]
    const landMarkPointCenter = [
      {
        "_x": 221.4089341366172,
        "_y": 276.52993110955447
      },
      {
        "_x": 226.58541407226326,
        "_y": 310.4335337096521
      },
      {
        "_x": 234.82109183608296,
        "_y": 342.60602573693484
      },
      {
        "_x": 242.72185968397858,
        "_y": 370.9977016860315
      },
      {
        "_x": 255.2919539564729,
        "_y": 401.6463470870325
      },
      {
        "_x": 273.8322862142205,
        "_y": 424.06779484093875
      },
      {
        "_x": 295.25104985176324,
        "_y": 438.8537102156946
      },
      {
        "_x": 322.1720957213521,
        "_y": 451.2975807601282
      },
      {
        "_x": 360.38278651772737,
        "_y": 457.9165516310999
      },
      {
        "_x": 397.3807917886853,
        "_y": 446.2756615096399
      },
      {
        "_x": 421.0012418681264,
        "_y": 431.3695488387415
      },
      {
        "_x": 439.5518512779355,
        "_y": 414.57296375573367
      },
      {
        "_x": 454.23244989453553,
        "_y": 388.4703751021692
      },
      {
        "_x": 463.28032196103334,
        "_y": 356.6474113875696
      },
      {
        "_x": 466.9524515324712,
        "_y": 326.44105152428835
      },
      {
        "_x": 469.9096007400632,
        "_y": 294.57711223901003
      },
      {
        "_x": 470.40957129536866,
        "_y": 260.30648903191775
      }
      ,
      {
        "_x": 450.40957129536866,
        "_y": 230.30648903191775
      },
      {
        "_x": 420.40957129536866,
        "_y": 200.30648903191775
      }
      ,
      {
        "_x": 280.40957129536866,
        "_y": 200.30648903191775
      }
      ,
      {
        "_x": 250.40957129536866,
        "_y": 230.30648903191775
      },
      {
        "_x": 221.4089341366172,
        "_y": 276.52993110955447
      }
    ]
  //   let i;
  //   if (ctx)
  //     ctx.clearRect(0, 0, 640, 480);
  //   for (i = 0; i < landMarkPoint.length - 1; i++) {
  //     // 640 480
  //     if (challengeTask === "turn-face-left") {
  //       myFunction(landMarkPoint[i]._x, landMarkPoint[i]._y, landMarkPoint[i + 1]._x, landMarkPoint[i + 1]._y);
  //     } else if (challengeTask === "turn-face-right") {
  //       myFunction(640 - landMarkPoint[i]._x, landMarkPoint[i]._y, 640 - landMarkPoint[i + 1]._x, landMarkPoint[i + 1]._y);
  //     }
  //   }
  //   for (i = 0; i < landMarkPointCenter.length - 1; i++) {
  //     if (challengeTask === "keep-face-ahead") {
  //       myFunction(landMarkPointCenter[i]._x, landMarkPointCenter[i]._y, landMarkPointCenter[i + 1]._x, landMarkPointCenter[i + 1]._y);
  //     }
    
  // }
  this.drawing();
}

// Draw detection box for face and nose
draw(drawOptions: DrawOptions) {
  if (drawOptions.faceDrawBoxOptions) {
    const faceAreaBox = {
      x: this.challengeDetails.areaLeft,
      y: this.challengeDetails.areaTop,
      width: this.challengeDetails.areaWidth,
      height: this.challengeDetails.areaHeight
    };
    this.drawArea(faceAreaBox, drawOptions.faceDrawBoxOptions);
  }
}
  // Draw bound area
  private drawArea(box: faceapi.IRect, drawBoxOptions: DrawBoxOptions) {
  const drawBox = new faceapi.draw.DrawBox(box, drawBoxOptions);
  drawBox.draw(this.canvasElement);
}
}
