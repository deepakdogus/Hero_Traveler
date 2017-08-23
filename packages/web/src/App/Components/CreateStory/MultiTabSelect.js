import React from 'react';
import Chip from 'material-ui/Chip';
import PropTypes from 'prop-types'

import DropDownTagMenu from './DropDownTagMenu'

const styles = {
  chip: {
    margin: 4,
    borderRadius: 4,
    zIndex: 90,
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    position: 'absolute',
    top: '12px',
    left: '48px',
  },
  deleteIconStyles: {
    backgroundColor: 'transparent',
    color: 'gray',
  },
};


export default class MultiTabSelect extends React.Component {
  static PropTypes = {
    togglePlaceholder: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {chipData: []};
    this.styles = {
      chip: {
        margin: 4,
      },
      wrapper: {
        display: 'flex',
        flexWrap: 'wrap',
      },
    };
  }

  handleRequestDelete = (key) => {
    this.chipData = this.state.chipData;
    const chipToDelete = this.chipData.map((chip) => chip.key).indexOf(key);
    this.chipData.splice(chipToDelete, 1);
    this.setState({chipData: this.chipData});
    this.props.togglePlaceholder(this.state.chipData.length)
  };

  handleTagAdd = (event, index, value) => {
    this.chipData = this.state.chipData;
    const currentChipKeys = this.chipData.map((chip) => chip.key);

    //check if tag already selected
    if(currentChipKeys.indexOf(value) < 0){
      this.chipData.push({ key: value, label: value })
      this.setState({chipData: this.chipData});
      this.props.togglePlaceholder(this.state.chipData.length)
    }
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
      <div style={styles.wrapper}>
        {this.state.chipData.map(this.renderChip, this)}
        <DropDownTagMenu handleTagAdd={this.handleTagAdd}/>
      </div>
    );
  }
}