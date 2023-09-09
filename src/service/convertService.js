class ConvertService {
    _apiBase="http://apilayer.net/api/live";
    _apiKey="6c64e6818591653264a635317f6a40c2";
    _source="USD";

    getResource = async (url) => {
        let res = await fetch(url);

        if (!res.ok) throw Error(res.message);

        return await res.json();
    }

    getQuotes = async (name="") => {
        const res = await this.getResource(`${this._apiBase}?access_key=${this._apiKey}&source=${this._source}&format=1&currencies=${name}`);

        return res.quotes;
    }
}

export default ConvertService;