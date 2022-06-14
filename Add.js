'use strict';

class Add extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            episodes: [],
            loading: false,
            error: null,
        };
        this.getList = this.getList.bind(this);
        this.deleteEpisode = this.deleteEpisode.bind(this);
        this.sortDown = this.sortDown.bind(this);
        this.sortUp = this.sortUp.bind(this);
    }

    async getList () {
        try {
            await this.setState(prevState => ({ loading: !this.state.loading }));
            const response = await fetch('https://breakingbadapi.com/api/episodes');
            let data = await response.json();
            data = data.map(obj => ({ ...obj, persons: 1 }));
            console.log(data);
            await this.setState(prevState => ({ episodes: data, loading: !this.state.loading }));
        } catch (e) {
            this.setState(prevState => ({ error: `Ошибка получения данных: ${e}.` }))
        }
    };

    deleteEpisode (e) {
        e.preventDefault();
        const id = Number(e.target.id);
        this.setState(prevState => ({ episodes: this.state.episodes.filter(episode => episode.episode_id !== id) }));
    }

    sortDown () {
        const sortArrDown = this.state.episodes.sort((a, b) => b.persons - a.persons);
        this.setState(prevState => ({ episodes: sortArrDown }));
    }

    sortUp () {
        const sortArrUp = this.state.episodes.sort((a, b) => a.persons - b.persons);
        this.setState(prevState => ({ episodes: sortArrUp }));
    }

    render () {

        if (this.state.loading) {
            return (<p>Загрузка...</p>)
        };

        if (this.state.error) {
            return (<p>{this.state.error}</p>)
        };

        if (this.state.episodes.length) {
            return (
                <div>
                    <div>
                        <button
                            className='btn-sort'
                            onClick={this.sortDown}
                        >Сортировать по убыванию количества персонажей</button>
                    </div>
                    <div>
                        <button
                            className='btn-sort'
                            onClick={this.sortUp}
                        >Сортировать по возрастанию количества персонажей</button>
                    </div>
                    {this.state.episodes.map((episode, index) => (

                        <div className='container'
                             key={episode.episode_id}>

                            <div key={episode.episode_id + 'a'} className='container__title-box'>
                                <div key={episode.episode_id + 'aa'} className='container__title'>
                                    Эпизод № {episode.episode}
                                    &nbsp;
                                    &nbsp;
                                    &nbsp;
                                    {episode.season} сезона
                                    <br/>
                                    '{episode.title}'
                                </div>

                                <div key={episode.episode_id + 'ab'} className='container__person'>
                                    <button key={episode.episode_id + 'abb'} className='container__btn-count' onClick={() => {
                                            if (episode.persons > 0) {
                                                return this.setState(prevState => (episode.persons -= 1))
                                            };
                                            return episode.persons;
                                        }
                                    }>-</button>
                                    {episode.persons}
                                    <button key={episode.episode_id + 'abc'} className='container__btn-count' onClick={() => this.setState(prevState => (episode.persons += 1))}>+</button>
                                    <div>
                                        {episode.persons === 1 && 'персонаж'}
                                        {(episode.persons > 1 && episode.persons < 5) && 'персонажа'}
                                        {episode.persons >= 5 && 'персонажей'}
                                    </div>
                                </div>
                            </div>
                            <button
                                key={episode.episode_id + 'btn'}
                                id={episode.episode_id}
                                className='container__btn-delete'
                                onClick={this.deleteEpisode}
                                >
                                    Удалить
                            </button>
                        </div>
                    ))}
                </div>
            )};

        return (
            <button className="btn-get-episode" onClick={this.getList}>Загрузить эпизоды</button>
        )
    }

};

ReactDOM.render(React.createElement(Add), document.querySelector('#add'));