import React, { useEffect, useState } from "react";
import Prism from "prismjs";

import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-javascript";

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
    gistUrl: "https://gist.github.com/VsevolodEpihin/621a10c3a9f4b4d471ed342920ba1886",
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
    gistUrl: "https://gist.github.com/VsevolodEpihin/680325a203b5d38d9e357c122ab30600",
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
    gistUrl: "https://gist.github.com/VsevolodEpihin/ada48deb69723e8a178922307f3c068e",
  },
];

const CodeAccordion: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    Prism.highlightAll();
  }, [openIndex]);

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
              <a
                href={item.gistUrl}
                className="code-accordion-github"
                target="_blank"
                rel="noopener noreferrer"
                title="Открыть Gist на GitHub"
                onClick={(e) => e.stopPropagation()}
                style={{ marginLeft: 8, display: "flex", alignItems: "center" }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.09.66-.22.66-.48 0-.24-.01-.87-.01-1.7-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.1-1.46-1.1-1.46-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0 1 12 6.8c.85.004 1.71.115 2.51.337 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.85 0 1.33-.01 2.4-.01 2.73 0 .27.16.58.67.48A10.01 10.01 0 0 0 22 12c0-5.52-4.48-10-10-10z"
                    fill="#24292f"
                  />
                </svg>
              </a>
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
                <code className="language-typescript">{item.code}</code>
              </pre>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CodeAccordion;
