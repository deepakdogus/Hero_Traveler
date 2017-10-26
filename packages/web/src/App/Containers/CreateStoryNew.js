import React, { Component } from 'react'
import styled from 'styled-components'
import {Route} from 'react-router-dom'
import {connect} from 'react-redux'
import {push} from 'react-router-redux';

import StoryCreateActions from '../Shared/Redux/StoryCreateRedux'
import API from '../Shared/Services/HeroAPI'

import CreateStoryCoverContent from './CreateStory/1_CoverContent'
import FooterToolbar from '../Components/CreateStory/FooterToolbar'

const api = API.create()

const Container = styled.div``

const ContentWrapper = styled.div`
  margin: 0 17%;
`

const ItemContainer = styled.div`
  margin: 40px 0;
`

function isNew(props) {
  const draftId = props.match.params.draftId
  return draftId === 'new'
}

/*
this container is in charge of creating/loading the appropriate draft
and dealing with update logic
*/
class CreateStory extends Component {
  componentWillMount() {
    const draftId = this.props.match.params.draftId
    if (isNew(this.props)) {
      this.props.registerDraft()
    }
    else if (draftId && !this.props.draft) {
      this.props.loadDraft(draftId)
    }
    // if draftId and no draft - load story
  }

  componentWillReceiveProps(nextProps) {
    const {match, reroute, draft} = nextProps
    // once our draft is loaded be sure to reroute
    if (draft.id && match.isExact) {
      reroute(`/createStoryNew/${draft.id}/cover`)
    }
  }

  _updateDraft = () => {
    const draft = this.props.draft
    const workingDraft = this.props.workingDraft
    let coverPromise;
    if (workingDraft.tempCover) {
      coverPromise = api.uploadCoverImage(workingDraft.id, workingDraft.tempCover)
      .then(response => response.data)
    }
    else coverPromise = Promise.resolve(workingDraft)
    this.props.updateDraft(draft.id, workingDraft)
  }

  _discardDraft = () => {
    this.props.discardDraft(this.props.draft.id)
  }

  render() {
    const {workingDraft, match} = this.props
    return (
      <Container>
        <ContentWrapper>
          { workingDraft &&
            <ItemContainer>
              <Route
                path={`${match.url}/cover`}
                component={CreateStoryCoverContent}
              />
            </ItemContainer>
          }
        </ContentWrapper>
        <FooterToolbar
          discardDraft={this._discardDraft}
          updateDraft={this._updateDraft}
          isDetailsView={false}
        />
      </Container>
    )
  }
}


function mapStateToProps(state) {
  return {
    draft: state.storyCreate.draft,
    workingDraft: state.storyCreate.workingDraft,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    registerDraft: () => dispatch(StoryCreateActions.registerDraft()),
    loadDraft: (draftId) => dispatch(StoryCreateActions.editStory(draftId)),
    reroute: (path) => dispatch(push(path)),
    discardDraft: (draftId) => dispatch(StoryCreateActions.discardDraft(draftId)),
    updateDraft: (draftId, attrs, doReset) =>
      dispatch(StoryCreateActions.updateDraft(draftId, attrs, doReset)),
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(CreateStory)
