import React from "react";
import "prismjs/themes/prism-tomorrow.css";
// @ts-ignore
import Prism from "prismjs";
import "./CodeShowcase.css";

const codeExamples = [
  {
    title: "Хук для определения типа запроса(https/websocket)",
    language: "jsx",
    code: `export type TransportRequest<TPayload> = {
  action: string;
  payload: TPayload;
}

export type TransportResponse<TResponse> = {
  id: number;
  result: TResponse;
}

type TransportType = "http" | "ws";

interface UseTransportOptions {
  preferred?: TransportType;
  wsUrl?: string;
}

export function useTransport<TPayload, TResponse>(
  options: useTransportOptions = {}
) {
  const { preffered = "http", wsUrl = "ws://localhost:3000" } = options;
  const [transport, setTransport] = useState<TransportType>('http');
  const wsRef = useRef<WebSocket | null>(null);
  const listeners = useRef<
    Map<number, (data: TransportResponse<TResponse>) => void>
  >(new Map());
  
  useEffect(() => {
    if(preferred !== "ws") {
      setTransport("http");
      return;
    }
    
    let ws: WebSocket;
    
    const cleanup = () => {
      ws?.close();
      listeners.current.clear();
    };
    
    const connect = () => {
      let socket: WebSocket;
      
      try {
        socket = new WebSocket(wsUrl);
      } catch(err) {
        setTransport("http");
        return;
      }
      
      socket.onopen = () => {
        wsRef.current = socket;
        setTransport("ws");
        
        socket.onmessage = (event) => {
          try {
            const data: TransportResponse<TResponse> = JSON.parse(event.data);
            const listener = listeners.current.get(data.id);
            if(listener) {
              listener(data);
              listeners.current.delete(data.id);
            }
          } catch(err) {
            console.error("Invalid WS message:", err);
          }
        };
      };
      
      socket.onerror = () => {
        setTransport("http");
      };
      
      ws = socket;
    };
    
    connect();
    
    return cleanup;
  }, [preferred, wsUrl])
  
  const send = (
    req: TransportRequest<TPayload>
  ): Promise<TResponse> => {
    return new Promise((resolve, reject) => {
      const id = Date.now();

      if (transport === "ws" && wsRef.current?.readyState === WebSocket.OPEN) {
        const message = JSON.stringify({ id, ...req });
        listeners.current.set(id, (data) => resolve(data.result));
        wsRef.current.send(message);
      } else {
        fetch("/api", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(req),
        })
          .then((res) => {
            if (!res.ok) throw new Error(HTTP res.status});
            return res.json() as Promise<TResponse>;
          })
          .then(resolve)
          .catch(reject);
      }
    });
  };

  return { transport, send };
}`,
  },
  {
    title: "WS Class",
    language: "graphql",
    code: `export class WS {
  protected socket!: WebSocket;
  protected url: string;
  protected reconnection = 0;
  protected maxOfReconnections = 3;
  constructor(url: string) {
    this.url = url;
    this.connect();
  }
  protected connect() {
    try {
      this.socket = new WebSocket(this.url);
      this.socket.addEventListener('open', this.onOpen.bind(this));
      this.socket.addEventListener('error', this.onError.bind(this));
      this.socket.addEventListener('close', this.onClose.bind(this));
    } catch (error) {
      console.error('Connecting WS:', error);
    }
  }
  protected reconnect() {
    this.reconnection += 1;
    this.connect();
  }
  protected onOpen() {
    this.reconnection = 0;
    console.log('WS connection is open:', this.url);
  }
  protected onError(error: Event) {
    console.error('WebSocket error:', error);
  }
  protected onClose(event: CloseEvent) {
    // code = 1000 is a normal closure
    if (event.code !== 1000 && this.reconnection < this.maxOfReconnections) {
      setTimeout(this.reconnect.bind(this), 3000);
    }
  }
  close() {
    this.socket.close(1000, 'The application is closed');
  }
  isConnected() {
    return this.socket?.readyState === 1;
  }
  send(data: object) {
    if (this.isConnected()) {
      this.socket.send(JSON.stringify(data));
    }
  }`,
  },
  {
    title: "Unit-тест на react-testing-library",
    language: "js",
    code: `import { render, screen } from '@testing-library/react';
import Button from './Button';

test('renders button', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText(/click me/i)).toBeInTheDocument();
});`,
  },
];

const CodeShowcase: React.FC = () => {
  React.useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <section className="code-showcase-section section-animate visible">
      <h2>Примеры кода из проектов</h2>
      <div className="code-showcase-list">
        {codeExamples.map((ex, idx) => (
          <div className="code-block" key={idx}>
            <div className="code-title">{ex.title}</div>
            <pre className={`language-${ex.language}`}>
              <code className={`language-${ex.language}`}>{ex.code}</code>
            </pre>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CodeShowcase;
