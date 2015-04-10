/////////////////////
// Black hole solver
/////////////////////

window.BlackHoleSolver = {};

(function (exports, numeric) {

  // exports

  exports.computeBlackHoleTables = function (startRadius, numAngleDataPoints, maxAngle, optionalNumIterationsInODESolver) {
    var angleStep = maxAngle / numAngleDataPoints;
    var inAngles = [];
    for (var angle = 0.0; angle < maxAngle; angle += angleStep) {
      inAngles.push(angle);
    }
    var outAngleResults = getOutAngleResultsTableForInAngles(inAngles, startRadius, optionalNumIterationsInODESolver);

    // Find the largest value that will fall into the black hole.
    var maxInBlackHoleAngle = 0;
    var outAngles = [];
    for (var i = 0; i < inAngles.length; i++) {
      if (outAngleResults[i].inBlackHole) {
        maxInBlackHoleAngle = inAngles[i];
      }
      var outAngle = outAngleResults[i].angle;
      // transform out-angles to be from line that goes toward black hole.
      outAngles.push(-1 * outAngleResults[i].angle);
    }

    return {
      maxInBlackHoleAngle: degreesToRadians(maxInBlackHoleAngle),
      inAngles: inAngles.map(degreesToRadians),
      outAngles: outAngles.map(degreesToRadians)
    };
  }

  var degreesToRadians = function (degrees) {
    return degrees * Math.PI / 180;
  }

  // helpers

  var getOutAngleResultsTableForInAngles = function (angles, startRadius, optionalNumIterations) {
    return angles.map(function (angle) {
      return getBlackHoleSolution(angle, startRadius, 0, 20 * Math.PI, optionalNumIterations);
    }).map(function (sol) {
      return getXYPhotonPathFromSolution(sol);
    }).map(function (photonPath) {
      if (endsInVicinityOfBlackHole(photonPath)) {
        return {inBlackHole: true};
      }
      var finalSlope = getFinalSlope(photonPath);
      var ret = {
        angle: getAngleFromSlope(finalSlope)
      };
      return ret;
    });
  }

  var plotPhotonPathsForAngles = function (angles, startRadius, optionalNumIterations) {
    var angleTable = {};
    var photonPaths = angles.map(function (angle) {
      return getBlackHoleSolution(angle, startRadius, 0, 20 * Math.PI, optionalNumIterations);
    }).map(function (sol) {
      return getXYPhotonPathFromSolution(sol);
    });
    workshop.plot(photonPaths, { xaxis: { min: -1 * startRadius, max: startRadius }, yaxis: { min: -1 * startRadius, max: startRadius } });
  }

  var getXYPhotonPathFromSolution = function (sol) {
    var rValues = numeric.transpose(sol.y)[0].map(function (val) {
      return 1 / val;
    });
    var thetaValues = sol.x;
    var photonPath = [];
    for (var i = 0; i < rValues.length; i++) {
      if (rValues[i] < 0) break;
      var x = rValues[i] * Math.cos(thetaValues[i]);
      var y = rValues[i] * Math.sin(thetaValues[i]);
      photonPath.push([x, y]);
    }
    return photonPath;
  }

  var endsInVicinityOfBlackHole = function(photonPath) {
    if (photonPath.length < 1) throw "At least one photonPath coord required to compute whether ends in vicinity of black hole";
    var last = photonPath[photonPath.length - 1];
    var x = last[0];
    var y = last[1];
    return Math.abs(x) < 1 && Math.abs(y) < 1;
  }

  var getFinalSlope = function (photonPath) {
    if (photonPath.length < 2) throw "Not enough photonPath coords to compute a slope!";
    var a = photonPath[photonPath.length - 2];
    var b = photonPath[photonPath.length - 1];
    return {
      xComponent: b[0] - a[0],
      yComponent: b[1] - a[1]
    };
  }

  var getAngleFromSlope = function (slope) {
    var angleInRad = Math.atan2(slope.yComponent, slope.xComponent);
    var angleInDegrees = angleInRad * 180 / Math.PI;
    return angleInDegrees;
  }

  var getBlackHoleSolution = function (startAngleDegrees, startRadius, startT, endT, optionalNumIterations) {
    var numIterations = optionalNumIterations || 100;
    return numeric.dopri(
      startT, 
      endT, 
      [1.0/startRadius, 1/(startRadius * Math.tan(startAngleDegrees * Math.PI / 180.0))], 
      blackHoleSystem, 
      undefined, 
      numIterations
    );
  }

  var blackHoleSystem = function (t, x) {
    var u = x[0];
    var u_prime = x[1];
    var u_double_prime = 3*u*u - u;
    return [u_prime, u_double_prime];
  }

})(window.BlackHoleSolver, window.numeric);


///////////////////
// Draw black hole
///////////////////

window.BlackHole = {};

(function (exports, BlackHoleSolver) {

  window.counter = 0;

  // exports

  exports.blackHoleifyImage = function (canvasId, backgroundImageSrc, opt) {
    var image = new Image();
    image.crossOrigin = 'Anonymous';
    image.onload = function() {
      init(canvasId, image, opt);
    }
    image.src = backgroundImageSrc;
  }

  var init = function (placeholderId, image, opt) {
    var placeholder = document.getElementById(placeholderId);
    try {
      var canvas = fx.canvas();
    } catch (e) {
      placeholder.innerHTML = e;
      return;
    }
    var texture = canvas.texture(image);
    canvas.draw(texture).update().replace(placeholder);

    opt = opt || {};
    var distanceFromBlackHole = 30 || opt.distanceFromBlackHole;
    var numAngleTableEntries = 100 || opt.numAngleTableEntries;
    var fovAngleInDegrees = 80 || opt.fovAngleInDegrees;
    var fovAngleInRadians = fovAngleInDegrees * Math.PI / 180;

    var blackHoleTables = BlackHoleSolver.computeBlackHoleTables(distanceFromBlackHole, numAngleTableEntries, fovAngleInDegrees);

    var blackHoleVisible = false;
    $(canvas).mousemove(function (evt) {
      var offset = $(canvas).offset();
      var x = evt.pageX - offset.left;
      var y = evt.pageY - offset.top;
      canvas.draw(texture).blackHole(x, y, blackHoleTables, fovAngleInRadians).update();
      blackHoleVisible = true;
    });
    $(canvas).mouseleave(function (evt) {
      if (blackHoleVisible) {
        canvas.draw(texture).update();
        blackHoleVisible = false;
      }
    });
  }
})(window.BlackHole, window.BlackHoleSolver);