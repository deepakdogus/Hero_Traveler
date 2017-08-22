import React from 'react';
import styled from 'styled-components'
import PropTypes from 'prop-types';

import DropDownMenu from 'material-ui/DropDownMenu';
import Chip from 'material-ui/Chip';
import MenuItem from 'material-ui/MenuItem';

const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder',
];

const chips = [];


const styles = {
  chip: {
    margin: 4,
    borderRadius: 4,
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    position: 'absolute'
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
};




export default class MultiTabSelect extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    	value: 1,
    	chipData: [],
	};
  }

 
  chips(names) {
  	return names.map((name, index) => (
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
  	this.chipData = this.state.chipData;
  	this.isSelected = this.chipData.filter((chip) => chip.label === value )
  	
  	if(!this.isSelected.length){

  		this.chipData.push({key: this.chipData.length, label: value})

  		this.setState({value, chipData: this.chipData });	
  	}

  }

  handleRequestDelete = (key) => {
    this.chipData = this.state.chipData;
    const chipToDelete = this.chipData.map((chip) => chip.key).indexOf(key);
    this.chipData.splice(chipToDelete, 1);
    this.setState({chipData: this.chipData});
  };

  menuItems(names) {
  	return names.map((name, index) => (
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
      	<div style={styles.wrapper}>{this.state.chips}</div>

      <div style={styles.wrapper}>
        {this.state.chipData.map(this.renderChip, this)}
      </div>      	
        <DropDownMenu
          value={null}
          onChange={this.handleChange}
          style={styles.menuStyles}
          menuItemStyle={styles.menuItemStyles}
          autoWidth={false}
          animated={false}
          underlineStyle={{display: 'none'}}
          listStyle={styles.listStyles}
          iconButton={null}
          maxHeight={400}
        >
			{this.menuItems(names)}
        </DropDownMenu>
      </div>
    );
  }
}