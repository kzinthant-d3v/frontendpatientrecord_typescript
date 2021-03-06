import React from 'react';
import { ReactComponent as DownArrow } from './assets/arrowicon.svg';
import './styles/index.css';
import Checkbox from '../checkbox';
import colors from '../global/themes/colors';
import { ThemeContext } from '../global/context/ThemeProvider';

type Check = {
  id: string;
  label: string;
  checked: boolean;
  stock?: number;
}

type TDropdown = {
  label: string;
  width?: number;
  list: Check[];
  dateKey: string;
  setAction: (id:string, action: boolean, date: string) => void;
  }

function Dropdown({
  label, width, list, setAction, dateKey,
}: TDropdown): JSX.Element {
  const [state, setState] = React.useState(false);
  const { theme } = React.useContext(ThemeContext);

  const [showlist, setShowlist] = React.useState(list);
  const [search, setSearch] = React.useState('');
  const inputRef = React.useRef<null|HTMLInputElement>(null);
  const [hover, setHover] = React.useState(false);

  React.useEffect(() => {
    if (search) {
      setShowlist(list.filter((l) => l.label.toLowerCase().includes(search.toLowerCase())));
    } else {
      setShowlist(list);
    }
  }, [search, list]);

  React.useEffect(() => {
    if (state) inputRef?.current?.focus();
  }, [state]);

  const { inputback, text, level1 } = colors;

  const toggle = (e: React.MouseEvent<HTMLDivElement>):void => {
    e.stopPropagation();
    setState((prev) => !prev);
  };

  const preventClose = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.stopPropagation();
  };

  React.useEffect(() => {
    const modal = document.getElementById('modal');
    function listener():void {
      if (!hover) {
        setState(false);
      }
    }
    modal?.addEventListener('click', listener);
    return () => modal?.removeEventListener('click', listener);
  }, [hover]);

  return (
    <div id="drop">
      <div
        id="dropbox"
        style={{
          width: `${width}px`,
        }}
      >
        <div
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          aria-hidden="true"
          onClick={toggle}
          id="box"
          style={{ backgroundColor: inputback[theme], width }}
        >
          <span id="label">
            {label}
          </span>
        </div>
        <div
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          aria-hidden="true"
          id="arrow"
          onClick={toggle}
        >
          <DownArrow />
        </div>
      </div>
      {
        state
      && (
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={preventClose}
        aria-hidden="true"
        id="boxarea"
        style={{ backgroundColor: `${theme === 'light' ? 'white' : level1[theme]}`, width }}
      >
        <div onClick={preventClose} aria-hidden="true" className="listarea">
          <div>
            <input
              ref={inputRef}
              style={{ backgroundColor: inputback[theme], color: text[theme] }}
              id="searchlist"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoComplete="off"
            />
          </div>
        </div>
        {
          (showlist && showlist.length > 0) && showlist.map((ele) => {
            let available = true;
            if (ele.stock !== undefined) {
              if (ele.stock === 0) available = false;
            }
            return (
              <div
                key={ele.id}
                onClick={(e) => {
                  preventClose(e);
                }}
                aria-hidden="true"
                className="listarea"
              >

                <Checkbox
                  label={`${ele.label}`}
                  checked={ele.checked}
                  avail={available}
                  toExe={() => { setAction(ele.id, !ele.checked, dateKey); }}
                />
              </div>
            );
          })
        }
      </div>
      )

      }
    </div>
  );
}

Dropdown.defaultProps = {
  width: 300,
};

export default Dropdown;
