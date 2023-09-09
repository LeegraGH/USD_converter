import { useState, useEffect, useMemo } from 'react';
import ConvertService from '../../service/convertService';

import './App.css';

const App = () => {
  const [quotes, setQuotes] = useState({});
  const [currentQuote, setCurrentQuote] = useState({name: "USD", value: 0});
  const [multiplier, setMultiplier] = useState(0);

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
    if (typeof value === "number" && value>0) setMultiplier(value);
    else setMultiplier(0);
  }

  const listQuotes = useMemo(()=>{
    return Object.keys(quotes).map((currency, i)=>(<option key={i}>{currency.slice(3)}</option>));
  }, [quotes]);
  
  const total = useMemo(()=>{
    return (currentQuote.value!==0&&multiplier!==0)?(currentQuote.value*multiplier).toFixed(2):multiplier;
  }, [currentQuote, multiplier]);

  return (
    <div className="app">
      <h1 className='title'>USD Converter</h1>
      <div className="converted_values__block">
      <div className="convert value_from">
          <div className="currency_value">{multiplier}</div>
          <div className="currency_name">USD</div>
        </div>
        <i className="fa-solid fa-arrow-right"></i>
        <div className="convert value_to">
          <div className="currency_value">{total}</div>
          <div className="currency_name">{currentQuote.name}</div>
        </div>
      </div>
      <div className='converted_settings__block'>
        <select id="quotes" autoFocus onChange={e=>onLoadCurrentQuote(e.target.value)}>
          {listQuotes}
        </select>
        <input type="text" onChange={e=>onLoadMultiplier(+(e.target.value))}/>
      </div>
    </div>
  )
}

export default App;
