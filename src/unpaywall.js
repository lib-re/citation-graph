import {render, html} from 'https://unpkg.com/lit-html@1.1.1/lit-html?module';

let unpaywall_url = (doi) => { return `https://api.unpaywall.org/v2/${doi}?email="libre.oasys@gmail.com`};
getDataFromJSONFileAndCallRenderFunction(unpaywall_url(current_doi), renderUnpaywall);

const unpaywall_info_template = (data) => html`
  <hr />
  <dl>
    <dt>title</dt><dd>${data.title}</dd>
    <dt>doi</dt><dd><a target="_blank" href="${data.doi_url}">${data.doi}</a></dd>
    <dt>journal</dt><dd>${data.journal}</dd>
    <dt>publisher</dt><dd>${data.publisher} ${data.published_date}</dd>
    <dt>authors</dt><dd>${data.authors}</dd>
  </dl>
  ${data.url_for_pdf 
    ? html`<em>Open Access Version provided by Unpaywall: <a download class="btn" href="${data.url_for_pdf}" target="_blank">Download</a></em>` 
    : html``
  }
  <hr />
`;
async function renderUnpaywall(data){
  let parsed_data = data;
  console.log(data);
  parsed_data['type'] = data['genre'];
  parsed_data['is_oa'] = data['is_oa'];
  parsed_data['journal'] = data['journal_name'];
  parsed_data['url_for_pdf'] = data.best_oa_location ? data['best_oa_location']['url_for_pdf'] : "";
  
  let authors = [];
  let ls_authors = data['z_authors'];
  for(let i=0; i< ls_authors.length; i++){
    try{
      let author_entry = `${ls_authors[i]['family']}, ${ls_authors[i]['given']}`;
      console.log("author: ", author_entry);
      authors.push(author_entry.toString());
    }catch{ console.log("error with author: "+ i); }
  }
  parsed_data['authors'] = authors.join("; ");
  render(unpaywall_info_template(parsed_data), document.getElementById("unpaywall"));
}
