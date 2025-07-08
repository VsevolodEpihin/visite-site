import React, { useState } from "react";
import "./CodeAccordion.css";

const cases = [
  {
    title: "WS.ts",
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
    title: "asyncTaskManager.ts",
    code: `import { useRef, useState, useCallback, useEffect } from 'react'

type AsyncTaskStatus = 'idle' | 'pending' | 'resolved' | 'rejected'

interface AsyncTaskManager<TArgs extends unknown[], TResult> {
  run: (...args: TArgs) => Promise<Nullable<TResult>>
  cancel: () => void
  restart: () => Promise<Nullable<TResult>>
  status: AsyncTaskStatus
  error: Nullable<Error>
  result: Nullable<TResult>
  isPending: boolean
  isResolved: boolean
  isRejected: boolean
}

export function useAsyncTaskManager<TArgs extends unknown[], TResult>(
  asyncFunction: (...args: TArgs) => Promise<TResult>
): AsyncTaskManager<TArgs, TResult> {
  const [status, setStatus] = useState<AsyncTaskStatus>('idle')
  const [error, setError] = useState<Nullable<Error>>(null)
  const [result, setResult] = useState<Nullable<TResult>>(null)

  const isMounted = useRef(true)
  const controller = useRef<Nullable<AbortController>>(null)
  const lastArgs = useRef<Nullable<TArgs>>(null)

  const cancel = useCallback(() => {
    controller.current?.abort()
    controller.current = null
    setStatus('idle')
  }, [])

  const run = useCallback(async (...args: TArgs): Promise<Nullable<TResult>> => {
    cancel()
    lastArgs.current = args
    controller.current = new AbortController()
    const signal = controller.current.signal

    setStatus('pending')
    setError(null)

    try {
      const res = await asyncFunction(...args)
      if (signal.aborted || !isMounted.current) return;
      setResult(res)
      setStatus('resolved')
      return res;
    } catch (err) {
      if (!signal.aborted && isMounted.current) {
        setError(err as Error)
        setStatus('rejected')
      }
      return null;
    }
  }, [asyncFunction, cancel])

  const restart = useCallback(() => {
    if (lastArgs.current) {
      return run(...lastArgs.current)
    }
    return Promise.resolve(null)
  }, [run])

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
      cancel()
    }
  })

  return {
    run,
    cancel,
    restart,
    status,
    error,
    result,
    isPending: status === 'pending',
    isResolved: status === 'resolved',
    isRejected: status === 'rejected',
  }
}
}`,
  },
  {
    title: "useTransport.ts",
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
            if (!res.ok) throw new Error('fetch error');
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
];

const CodeAccordion: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="gists" className="code-accordion-section">
      <h2>Github Gists</h2>
      <div className="code-accordion-list">
        {cases.map((item, idx) => (
          <div className="code-accordion-item" key={item.title}>
            <button
              className="code-accordion-header"
              onClick={() => handleToggle(idx)}
              aria-expanded={openIndex === idx}
            >
              <span className="code-accordion-title">{item.title}</span>
              <span
                className={`code-accordion-arrow${
                  openIndex === idx ? " open" : ""
                }`}
              >
                ▶
              </span>
            </button>
            <div
              className={`code-accordion-panel${
                openIndex === idx ? " open" : ""
              }`}
              style={{ maxHeight: openIndex === idx ? 320 : 0 }}
            >
              <pre>
                <code>{item.code}</code>
              </pre>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CodeAccordion;
