import React from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import PropTypes from 'prop-types';


import {feedExample} from '../../Containers/Feed_TEST_DATA'

const tagNames = [];

//test tags
const categoriesExample = feedExample[Object.keys(feedExample)[0]].categories
for (var i=0; i<categoriesExample.length; i++)
    tagNames.push(categoriesExample[i].title)

const styles = {
  menuStyles: {
    width: '320px',
    height: '400px',
    position: 'absolute',
    left: '30px',
    textAlign: 'left',
    top: '0px',
    zIndex: '1',
  },
  menuItemStyles: {
    borderTop: 'none',
    borderLeft: 'none',
    borderRight: 'none',
    borderBottom: '1px solid #eeeeee',
    margin: '0px 10px 0px 10px',
    paddingLeft: '0px',
  },  
  listStyles: {
    textAlign: 'left',
  },
};

export default class DropDownMenuSimpleExample extends React.Component {

static propTypes = {
    handleTagAdd: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {value: "Never"};
  }

  menuItems(tagNames) {
    return tagNames.map((name) => (
      <MenuItem
        value={name}
        primaryText={name}
        key={name}
      />    
    ));
  }

  render() {
    return (
      <div>
        <DropDownMenu 
          value={this.state.value} 
          onChange={this.props.handleTagAdd}
          style={styles.menuStyles}
          menuItemStyle={styles.menuItemStyles}
          listStyle={styles.listStyles}
          underlineStyle={{display: 'none'}}
          labelStyle={{visibility: 'hidden'}}
          autoWidth={false}
          iconButton={null}
          maxHeight={400}
          anchorOrigin= {{vertical: 'bottom', horizontal: 'left',}}          
          >
          {this.menuItems(tagNames)}
        </DropDownMenu>
      </div>
    );
  }
}