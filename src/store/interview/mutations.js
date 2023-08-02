//
// Interviews
//

export function setInterviews (state, interviews) {
  state.interviews = [...interviews]
}

export function setInterviewPagination (state, payload) {
  state.interviewPaginationOpts = payload.interviewPaginationOpts
}

export function setInterviewCount (state, count) {
  state.interviewPaginationOpts.rowsNumber = count
}

//
// Interview Designs
//

export function setInterviewDesign (state, interviewDesign) {
  state.interviewDesign = interviewDesign
}

export function setInterviewDesigns (state, interviewDesigns) {
  state.interviewDesigns = [...interviewDesigns]
}

export function setInterviewDesignPagination (state, payload) {
  state.interviewDesignPaginationOpts = payload.interviewDesignPaginationOpts
}

export function setInterviewDesignCount (state, count) {
  state.interviewDesignPaginationOpts.rowsNumber = count
}

//
// Campaigns
//

export function setCampaigns (state, campaigns) {
  state.campaigns = [...campaigns]
}

export function setCampaignPagination (state, payload) {
  state.campaignPaginationOpts = payload.campaignPaginationOpts
}

export function setCampaignCount (state, count) {
  state.campaignPaginationOpts.rowsNumber = count
}
