import { useCallback, useMemo, useRef, useState } from "react"
import { Marker , Popup } from "react-leaflet"
import L from 'leaflet';
import { useGeoLocation } from "../../hooks/useGeoLocation"
import { LatLngExpression, Marker as LeafletMarker, } from "leaflet"
import { MyMarkerInterface } from "../services/add-new-service";


interface DraggableMarkerProps {

    defaultLat: number,
    defaultLng: number,
    updateCoordinates: (update: MyMarkerInterface)=>void

}


export function DraggableMarker({ defaultLat, defaultLng, updateCoordinates } : DraggableMarkerProps) {

    // const {  defaultCoordinates } = useGeoLocation()

    
    
    const [position, setPosition] = useState<LatLngExpression>({ lat: defaultLat, lng:defaultLng })
    
    const markerRef = useRef<L.Marker>(null);


    // console.log("new Position"+ position)
    
    const eventHandlers = useMemo(
      () => ({
        dragend() {
          const marker = markerRef.current
          if (marker != null) {
            updateCoordinates(marker.getLatLng())
            setPosition(marker.getLatLng())
          }
        },
      }),
      [],
    )
  
    return (
      <Marker
        draggable={true}
        eventHandlers={eventHandlers}
        position={position}

        ref={markerRef}>
        {/* <Popup minWidth={90}>
          <span >
          
               'Click here to make marker draggable'
          </span>
        </Popup> */}
      </Marker>
    )
  }