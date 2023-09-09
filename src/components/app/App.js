import { useState, useEffect, useMemo } from 'react';
import ConvertService from '../../service/convertService';

import './App.css';

const App = () => {
  const [quotes, setQuotes] = useState({});
  const [currentQuote, setCurrentQuote] = useState({name: "USD", value: 0});
  const [multiplier, setMultiplier] = useState({value: 0, correct: true, readOnly: false});

  const convertService = new ConvertService();

  useEffect(()=>{
    onQuotesLoaded();
    const updateValueQuotes=setInterval(onQuotesLoaded, 300000);
    return ()=>clearInterval(updateValueQuotes);
     // eslint-disable-next-line
  }, [])

  function onQuotesLoaded(){
    convertService.getQuotes()
    .then(setQuotes)
    .catch((e)=>console.log(e))
  }

  function onLoadCurrentQuote(currency) {
    setCurrentQuote({
      name: currency,
      value: quotes["USD"+currency]
    });
  }

  function onLoadMultiplier(value){
    if (typeof value === "number" && value>0) {
      setMultiplier({value: value, correct: true});
    } else if (value===0) {
      setMultiplier({value: 0, correct: true});
    }    
    else {
      setMultiplier({value: 0, correct: false});
    }
  }

  const listQuotes = useMemo(()=>{
    let currencies = [];
    try{
      currencies=Object.keys(quotes).map((currency, i)=>(<option key={i}>{currency.slice(3)}</option>));
    } catch(e) {
      setMultiplier({value: 0, correct: true, readOnly: true});
      return <div className="select currency_error">Error! Try to reload the page.</div>;
    }
    return (
      <select className="select" id="quotes" autoFocus onChange={e=>onLoadCurrentQuote(e.target.value)}>
          {currencies}
        </select>
    );
    // eslint-disable-next-line
  }, [quotes]);
  
  const total = useMemo(()=>{
    return (currentQuote.value!==0&&multiplier.value!==0)?(currentQuote.value*multiplier.value).toFixed(2):multiplier.value;
  }, [currentQuote, multiplier]);

  return (
    <div className="app">
      <h1 className='title'>USD Converter</h1>
      <div className="converted_values__block">
      <div className="convert value_from">
          <div className="currency_value">{multiplier.value}</div>
          <div className="currency_name">USD</div>
        </div>
        <i className="fa-solid fa-arrow-right"></i>
        <div className="convert value_to">
          <div className="currency_value">{total}</div>
          <div className="currency_name">{currentQuote.name}</div>
        </div>
      </div>
      <div className='converted_settings__block'>
        {listQuotes}
        <div className="input_value">
          <input type="text" readOnly={multiplier.readOnly} defaultValue={0} onChange={e=>onLoadMultiplier(+(e.target.value))}/>
          {multiplier.correct?null:<span className="correct">Please, enter a number.</span>}
        </div>
      </div>
    </div>
  )
}

export default App;
