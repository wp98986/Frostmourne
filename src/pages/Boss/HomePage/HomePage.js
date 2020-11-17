// import React from 'react';
// import { Card, Button } from 'antd';
// import PageHeaderWrapper from '@/components/PageHeaderWrapper';

// class HomePage extends React.Component {
//   state = {
//     text: '呵呵',
//   };

//   componentDidMount() {
//     console.log(21333);
//   }

//   shouldComponentUpdate(nextProps, nextState) {
//     const { text } = nextState;
//     return text !== this.state.text;
//   }

//   UNSAFE_componentWillUpdate() {
//     console.log('willupdate');
//   }

//   handleClick = () => {
//     this.setState({
//       text: 'hehe',
//     });
//   };

//   render() {
//     const { text } = this.state;
//     return (
//       <PageHeaderWrapper title="首页">
//         <Card>
//           sssdd
//           <Button type="primary" onClick={this.handleClick}>
//             {text}
//           </Button>
//         </Card>
//       </PageHeaderWrapper>
//     );
//   }
// }

// export default HomePage;

import React from 'react';
import { connect } from 'dva';

const HomePage = () => <div>3333</div>;

const mapStateToProps = ({ life = {} }) => 
  //   console.log(home.data);
   ({
    data: life.data,
  })
;

export default connect(mapStateToProps)(HomePage);
