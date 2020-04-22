import {render, html} from 'https://unpkg.com/lit-html@1.1.1/lit-html?module';

/* -- open citations:  -- */
const opencitations_base_url = "https://opencitations.net/index/coci/api/v1";

/** get DOI list from successful COCI response */
function parseDoiListFromCOCIResponse(data, key="citing"){
  let doi_list = [];
  if(data && data.length > 0){
    for(let i=0; i < data.length; i++){
      doi_list.push(data[i][key]);
    }
  }
  return doi_list;
}

// template for displaying a list of doi objects
const single_doi_template = (doi) => html`<li><strong>doi:</strong><a href="?doi=${doi}">${doi}</a></li>`
const list_of_dois_template = (ls_dois) => html`
  <ul>${ls_dois.map((doi) => single_doi_template(doi))}</ul>
`;

/* incoming citations */ 
fetchIncomingCitations(current_doi);
function fetchIncomingCitations(doi) {
  let incoming_url = `${opencitations_base_url}/citations/${doi}`;
  getDataFromJSONFileAndCallRenderFunction(incoming_url, renderIncoming);
}
async function renderIncoming(data){
  let doi_list = parseDoiListFromCOCIResponse(data, 'citing');
  render(list_of_dois_template(doi_list), document.getElementById("incoming"));
}

/* outgoing references */
fetchOutgoingReferences(current_doi);
function fetchOutgoingReferences(doi) {
  let outgoing_url = `${opencitations_base_url}/references/${doi}`;
  getDataFromJSONFileAndCallRenderFunction(outgoing_url, renderOutgoing);
}
async function renderOutgoing(data){
  let doi_list = parseDoiListFromCOCIResponse(data, 'cited');
  render(list_of_dois_template(doi_list), document.getElementById("outgoing"));
}