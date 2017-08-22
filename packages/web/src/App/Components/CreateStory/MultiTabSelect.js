import React from 'react';
// import styled from 'styled-components'
import PropTypes from 'prop-types';

import DropDownMenu from 'material-ui/DropDownMenu';
import Chip from 'material-ui/Chip';
import MenuItem from 'material-ui/MenuItem';

import {feedExample} from '../../Containers/Feed_TEST_DATA'

const tagNames = [];

//test tags
const categoriesExample = feedExample[Object.keys(feedExample)[0]].categories
for (var i=0; i<categoriesExample.length; i++)
    tagNames.push(categoriesExample[i].title)

const styles = {
  chip: {
    margin: 4,
    borderRadius: 4,
    zIndex: 100,
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    position: 'absolute',
    top: '12px',
    left: '48px',
  },
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
  deleteIconStyles: {
  	backgroundColor: 'transparent',
  	color: 'gray',
  },
};

let chipData;

export default class MultiTabSelect extends React.Component {
	  static PropTypes = {
    togglePlaceholder: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
    	value: 1,
    	chipData: [],
	};
  }
 
  chips(tagNames) {
  	return tagNames.map((name, index) => (
  		<Chip
  		key={name}
  		value={name}
  		style={styles.chip}
  		>
  		{name}
  		</Chip>
  	));
  }

  handleChange = (event, index, value) => {
  	chipData = this.state.chipData;
  	this.isSelected = chipData.filter((chip) => chip.label === value )
  	
  	if(!this.isSelected.length){
  		chipData.push({key: value, label: value});
  		this.setState({value, chipData: chipData });
  	}
  	this.props.togglePlaceholder(this.state.chipData.length)
  }

  handleRequestDelete = (key) => {
    chipData = this.state.chipData;
    const chipToDelete = chipData.map((chip) => chip.key).indexOf(key);
    chipData.splice(chipToDelete, 1);
    this.setState({chipData: chipData});
    this.props.togglePlaceholder(this.state.chipData.length)
  };

  menuItems(tagNames) {
  	return tagNames.map((name, index) => (
  		<MenuItem
	  		key={name}
	  		value={name}
	  		primaryText={name}
  		/> 		
  	));
  }

   renderChip(data) {
    return (
      <Chip
        key={data.key}
        backgroundColor='#eeeeee'
        deleteIconStyle={styles.deleteIconStyle}
        onRequestDelete={() => this.handleRequestDelete(data.key)}
        style={styles.chip}
      >
        {data.label}
      </Chip>
    );
  }

  render() {
  	return (
  		<div>
  		<div style={styles.wrapper}>
  		{this.state.chipData.map(this.renderChip, this)}
  		</div>      	
  		<DropDownMenu
	  		value={this.state.value}
	  		onChange={this.handleChange}
	  		style={styles.menuStyles}
	  		menuItemStyle={styles.menuItemStyles}
	  		autoWidth={false}
	  		animated={false}
	  		underlineStyle={{display: 'none'}}
	  		labelStyle={{visibility: 'hidden'}}
	  		listStyle={styles.listStyles}
	  		iconButton={null}
	  		maxHeight={400}
	  		anchorOrigin=	{{vertical: 'bottom', horizontal: 'left',}}
  		>
  		{this.menuItems(tagNames)}
  		</DropDownMenu>
  		</div>
  		);
  }
}