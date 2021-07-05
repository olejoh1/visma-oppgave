import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { Comparator, numberFilter } from 'react-bootstrap-table2-filter';

let sortFilter;
let isHidden = true;

const columns = [{
  dataField: 'account_number',
  text: 'Konto Nummer',
  sort: true
}, {
  dataField: 'description',
  text: 'Beskrivelse',
  sort: true
}, {
  dataField: 'period',
  text: 'Periode',
  sort: true
}, {
  dataField: 'balance',
  text: 'Balanse',
  sort: true,
  filter: numberFilter({
    getFilter: (filter) => {
      sortFilter = filter;
    }
  })
}];

const showClick = () => {
  if(isHidden){
    sortFilter({
      number: "-",
      comparator: Comparator.NE
    });
    isHidden = false;
  }
  else{
    sortFilter('');
    isHidden = true;
  }
};

export default ({accounts}) => (
  <div>
    <button id="btn-sort" onClick={showClick}>Trykk for å skjule/vise kontoene uten kreditt</button>

    <BootstrapTable keyField='id' data={ accounts } columns={ columns } filter={ filterFactory() }/>
  </div>
);