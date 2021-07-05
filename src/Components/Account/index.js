import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { Comparator, numberFilter } from 'react-bootstrap-table2-filter';

let sortFilter;
let isHidden = true;

//Grunnlaget for tabelen som blir vist på siden, med navnene på kolonene og hva den skal inneholde
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

//Funktionen for knappen på siden som tar bort og viser kontoene som ikke har registrer en saldo på seg
const showClick = () => {
  if(isHidden){
    sortFilter({
      number: "-",
      comparator: Comparator.NE
    });
    isHidden = false;
    HideButton();
  }
  else{
    sortFilter('');
    isHidden = true;
    HideButton();
  }
};

function HideButton() {
  if(isHidden){
    return (
      <button onClick={showClick}>
        Trykk for å skjule kontoene uten kreditt
      </button>
    );
  }
  else{
    return (
      <button onClick={showClick}>
        Trykk for å vise kontoene uten kreditt
      </button>
    );
  }
}

let button = HideButton();

export default ({accounts}) => (
  <div>
    {button}

    <BootstrapTable keyField='id' data={ accounts } columns={ columns } filter={ filterFactory() }/>
  </div>
);