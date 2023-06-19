import { View, Text, TextInput, ImageBackground } from 'react-native'
import React, { useState } from 'react'
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';

const MasterTasks = () => {
    const [mastertext, setMasterText] = useState('');
    return (
        <View style={{
            flex: 1,
        }}>
            <ReactNativeZoomableView
                maxZoom={1.5}
                minZoom={0.5}
                zoomStep={0.5}
                initialZoom={1}
                bindToBorders={true}
                onZoomAfter={this.logOutZoomState}
                panBoundaryPadding={0}
                doubleTapZoomToCenter={1}
                style={{
                }}
            >
                <View style={{
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start'
                }}>
                    <ImageBackground source={require('../../assets/table2.png')} style={{
                        width: '100%',
                        height: 800,
                        position: 'absolute',
                        top: -295,
                        left: -362,
                        right: 0
                    }}
                    >
                        <View>

                            <TextInput
                                // editable
                                // autoFocus
                                multiline
                                onChangeText={(mastertext) => setMasterText(mastertext)}
                                value={mastertext}
                                numberOfLines={25}
                                maxLength={400}
                                textAlignVertical='top'
                                // textAlign='left'

                                style={{
                                    height: 500,
                                    width: '100%',
                                    fontSize: 20,
                                    overflow: 'hidden',
                                    // justifyContent: 'center',
                                    // alignItems: 'flex-start'
                                }}
                            />
                        </View>
                    </ImageBackground>
                </View>
            </ReactNativeZoomableView>
        </View>
    )
}

export default MasterTasks