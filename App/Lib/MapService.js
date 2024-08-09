export const mapRef = {};
export const superClusterRef = {};
export const markersRef = {
  markers: {},
  redraws: [],
};

export function setMapRef(map) {
  if (map) {
    mapRef.map = map;
  }
}

export function setSuperClusterRef(superCluster) {
  if (superCluster) {
    superClusterRef.superCluster = superCluster;
  }
}

export function setMarkerRef(id, marker) {
  markersRef.markers[id] = marker;
}

export function removeMarkerRedraw(id) {
  if (id) {
    const index = markersRef.redraws.indexOf(id);
    if (index > -1) {
      markersRef.redraws.splice(index, 1);
    }
  } else {
    markersRef.redraws = [];
  }
}

export function addMarkerRedraw(id) {
  markersRef.redraws.push(id);
  markersRef.redraws = [...new Set(markersRef.redraws)];
}

export function redrawMarkers(type) {
  // console.log('MARKERS TO REDRAW', markersRef.redraws)

  if (type === 'all') {
    for (let [key, value] of Object.entries(markersRef.markers)) {
      markersRef.markers[key].redraw();
    }
  } else {
    // console.log('redraw needed')
    // console.log(markersRef)
    for (let index = markersRef.redraws.length - 1; index >= 0; index--) {
      // console.log('REDRAWING', markersRef.redraws[index])
      if (markersRef.markers[markersRef.redraws[index]]) {
        markersRef.markers[markersRef.redraws[index]].redraw();
      }
      markersRef.redraws.splice(index, 1);
    }
  }
}

export function calculateReportMaxDistance(beachSpotLength) {
  let maxDistance = beachSpotLength ? (beachSpotLength / 3) * 2 : 350;
  // console.log(maxDistance)
  maxDistance = maxDistance < 350 ? 350 : maxDistance;
  // console.log(maxDistance)
  return maxDistance / 1000;
}

function Deg2Rad(deg) {
  return (deg * Math.PI) / 180;
}

export function getGpsPointsDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = Deg2Rad(lat2 - lat1);
  const dLon = Deg2Rad(lon2 - lon1);
  lat1 = Deg2Rad(lat1);
  lat2 = Deg2Rad(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;

  // console.log(d)

  return d;

  // lat1 = Deg2Rad(lat1);
  // lat2 = Deg2Rad(lat2);
  // lon1 = Deg2Rad(lon1);
  // lon2 = Deg2Rad(lon2);
  // const R = 6371; // km
  // const x = (lon2 - lon1) * Math.cos((lat1 + lat2) / 2);
  // const y = (lat2 - lat1);
  // const d = Math.sqrt(x * x + y * y) * R;
  // return d;
}

export function isContainedInSquare(boundaries, point){
  return (boundaries.northEast.latitude > point.latitude && boundaries.northEast.longitude > point.longitude &&
    boundaries.southWest.latitude < point.latitude && boundaries.southWest.longitude < point.longitude)
}

export function getNearestSpot(spots, center, onlyIndex = false, except = []) {
  let minDif = 99999;
  let closest;
  // console.log(spots)
  // console.log(center)
  for (let index = 0; index < spots.length; ++index) {

    const dontSkip = !except.some((spot) => {
      return spot.id == spots[index].id
    })

    if (dontSkip) {

      // console.log(spots[index].latitude)
      // console.log(center)
      const dif = getGpsPointsDistance(
        center[0],
        center[1],
        spots[index].latitude,
        spots[index].longitude,
      );
      if (dif < minDif) {
        closest = index;
        minDif = dif;
      }
    }
  }

  if (onlyIndex) {
    return closest;
  } else {
    return spots[closest];
  }
}

function getGpsMiddle(prop, markers) {
  let values = markers.map(m => m[prop]);
  let min = Math.min(...values);
  let max = Math.max(...values);
  if (prop === 'lng' && (max - min > 180)) {
    values = values.map(val => val < max - 180 ? val + 360 : val);
    min = Math.min(...values);
    max = Math.max(...values);
  }
  let result = (min + max) / 2;
  if (prop === 'lng' && result > 180) {
    result -= 360
  }
  return result;
}

export function findGpsCenter(markers) {
  return {
    lat: getGpsMiddle('lat', markers),
    lng: getGpsMiddle('lng', markers)
  }
}

/// VIDEO STUFF
export const videpPlayerRef = {};
export function setVideoPlayerRef(playerRef) {
  if (playerRef) {
    videpPlayerRef.player = playerRef;
  }
}
export function setVideoPlayerPlaying(useState) {
  if (useState) {
    videpPlayerRef.playing = useState[0];
    videpPlayerRef.setPlaying = useState[1];
  }
}
