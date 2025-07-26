import { useState } from 'react';

const MapController = () => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div>
            <button onClick={() => setIsVisible(!isVisible)}>
                弹出底图Click
            </button>

            {/* <div style={{ display: isVisible ? 'block' : 'none' }}>
                <div id="basemapGalleryContainerRef" />
                cas
            </div> */}

            llll
        </div>
    );
};

export default MapController;