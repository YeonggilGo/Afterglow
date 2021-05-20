import React, {Component} from 'react';
import { StyleSheet, View, ScrollView} from 'react-native';
import Notice from '../../components/settings/Notice'

export default class SettingsNotice extends Component {

  constructor(props) {
    super(props);
    this.state = {
      menu :[
        {
            title : '정식 서비스 안내',
            subtitle: '2020. 05. 19. 18:00',
            content : ['여운의 정식 서비스가 얼마 남지 않았습니다.', '항상 노력하는 여운이 되겠습니다.', '감사합니다.']
        },
        {
            title : '서비스 업데이트 안내',
            subtitle: '2020. 05. 18. 20:00',
            content : ['서비스를 좀 더 원활히 이용할 수 있도록 서비스 로직 수정을 완료하였습니다.', '이용에 불편을 끼쳐서 죄송합니다.']
        },
        {
            title : '임시 점검 안내',
            subtitle: '2020. 05. 17. 12:00',
            content : ['서버 오류로 인해 임시 점검을 실시합니다.', '임시 점검 시간은 약 1시간 소요 예정입니다.']
        },
      ]
     }
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        { this.renderAccordians() }
      </ScrollView>
    );
  }

  renderAccordians=()=> {
    const items = [];
    for (item of this.state.menu) {
        items.push(
            <Notice 
                title = {item.title}
                subtitle = {item.subtitle}
                content = {item.content}
                key={item.title}
            />
        );
    }
    return items;
}
}

const styles = StyleSheet.create({
  container: {
   flex:1,   
  }
});