// export const distance = (pt1, pt2) => {
//   const lng1 = pt1.longitude, lat1 = pt1.latitude
//   const lng2 = pt2.longitude, lat2 = pt2.latitude
//   if (lat1 === lat2 && lng1 === lng2) {
//     return 0
//   }
//
//   const radlat1 = (Math.PI * lat1) / 180
//   const radlat2 = (Math.PI * lat2) / 180
//
//   const theta = lng1 - lng2
//   const radtheta = (Math.PI * theta) / 180
//
//   let dist =
//     Math.sin(radlat1) * Math.sin(radlat2) +
//     Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta)
//
//   if (dist > 1) {
//     dist = 1
//   }
//   dist = Math.acos(dist)
//   dist = (dist * 180) / Math.PI
//   return dist * 60 * 1.1515 * 1.609344
// }
//
// export const pathCost = path => {
//   return path
//     .slice(0, -1)
//     .map((point, idx) => distance(point, path[idx + 1]))
//     .reduce((a, b) => a + b, 0)
// }
//
// export const counterClockWise = (p, q, r) => {
//   return (q.latitude - p.latitude) * (r.longitude - q.longitude) < (q.longitude - p.longitude) * (r.latitude - q.latitude)
// }
//
// export const intersects = (a, b, c, d) => {
//   return (
//     counterClockWise(a, c, d) !== counterClockWise(b, c, d) &&
//     counterClockWise(a, b, c) !== counterClockWise(a, b, d)
//   )
// }
//
// export const setDifference = (setA, setB) => {
//   const ret = new Set(setA)
//   setB.forEach(p => {
//     ret.delete(p)
//   })
//   return ret
// }
//
// // export const setEvaluatingPaths = () => ({
// //   paths: [{ path }],
// //   cost: pathCost(path)
// // })
//
// export const convexHull = points => {
//
//   const sp = points[0]
//
//   // Find the "left most point"
//   let leftmost = points[0]
//   for (const p of points) {
//     if (p.longitude < leftmost.longitude) {
//       leftmost = p
//     }
//   }
//
//   const path = [leftmost]
//
//   while (true) {
//     const curPoint = path[path.length - 1]
//     let [selectedIdx, selectedPoint] = [0, null]
//
//     // find the "most counterclockwise" point
//     for (let [idx, p] of points.entries()) {
//       // eslint-disable-next-line
//       // setEvaluatingPaths(
//       //   () => ({
//       //     paths: [
//       //       {
//       //         path: [...path, selectedPoint || curPoint],
//       //       },
//       //       { path: [curPoint, p] }
//       //     ]
//       //   }),
//       //   2
//       // )
//
//       if (!selectedPoint || counterClockWise(curPoint, p, selectedPoint)) {
//         // this point is counterclockwise with respect to the current hull
//         // and selected point (e.g. more counterclockwise)
//         ;[selectedIdx, selectedPoint] = [idx, p]
//       }
//     }
//
//     // adding this to the hull so it's no longer available
//     points.splice(selectedIdx, 1)
//
//     // back to the furthest left point, formed a cycle, break
//     if (selectedPoint === leftmost) {
//       break
//     }
//
//     // add to hull
//     path.push(selectedPoint)
//   }
//
//   while (points.length > 0) {
//     let [bestRatio, bestPointIdx, insertIdx] = [Infinity, null, 0]
//
//     for (let [freeIdx, freePoint] of points.entries()) {
//       // for every free point, find the point in the current path
//       // that minimizes the cost of adding the path minus the cost of
//       // the original segment
//       let [bestCost, bestIdx] = [Infinity, 0]
//       for (let [pathIdx, pathPoint] of path.entries()) {
//         const nextPathPoint = path[(pathIdx + 1) % path.length]
//
//         // the new cost minus the old cost
//         const evalCost =
//           pathCost([pathPoint, freePoint, nextPathPoint]) -
//           pathCost([pathPoint, nextPathPoint])
//
//         if (evalCost < bestCost) {
//           ;[bestCost, bestIdx] = [evalCost, pathIdx]
//         }
//       }
//
//       // figure out how "much" more expensive this is with respect to the
//       // overall length of the segment
//       const nextPoint = path[(bestIdx + 1) % path.length]
//       const prevCost = pathCost([path[bestIdx], nextPoint])
//       const newCost = pathCost([path[bestIdx], freePoint, nextPoint])
//       const ratio = newCost / prevCost
//
//       if (ratio < bestRatio) {
//         ;[bestRatio, bestPointIdx, insertIdx] = [ratio, freeIdx, bestIdx + 1]
//       }
//     }
//
//     const [nextPoint] = points.splice(bestPointIdx, 1)
//     path.splice(insertIdx, 0, nextPoint)
//
//     // setEvaluatingPaths(() => ({
//     //   paths: [{ path }],
//     //   cost: pathCost(path)
//     // }))
//
//   }
//
//   // rotate the array so that starting point is back first
//   const startIdx = path.findIndex(p => p === sp)
//   path.unshift(...path.splice(startIdx, path.length))
//
//   // go back home
//   path.push(sp)
//   // const cost = pathCost(path)
//
//   // setEvaluatingPaths(() => ({
//   //   paths: [{ path }],
//   //   cost
//   // }))
//
//   return path
//
// }
