// @flow
import * as React from 'react'
import Carousel, { Pagination } from 'react-native-snap-carousel'
import { widthPercentageToDP } from 'react-native-responsive-screen'
import { View } from 'native-base'
import { ImageBackground } from 'react-native'

type Props = {
  data?: Array<string>
}
type State = {
  activeSlide: number
}
export default class ImageCarousel extends React.Component<Props, State> {

  state = {
    activeSlide: 0
  }

  render (): React.Node {
    return (
      <>
        <Carousel
          data={this.props.data || []}
          sliderWidth={widthPercentageToDP('100%')}
          itemWidth={widthPercentageToDP('50%')}
          onSnapToItem={(index) => this.setState({ activeSlide: index }) }
          renderItem={({ item }) =>
            <View>
              <ImageBackground
                source={{
                  uri: item.startsWith('http') ? item : 'data:image/png;base64, ' + item
                }}
                style={{ width: '100%', height: '100%' }}
                imageStyle={{ resizeMode: 'contain' }}
              />
            </View>
          }
        />
        <Pagination
          dotsLength={this.props.data ? this.props.data.length : 0}
          activeDotIndex={this.state.activeSlide}
          containerStyle={{ paddingVertical: 15 }}
        />
      </>
    )
  }
}
