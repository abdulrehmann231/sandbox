"use client"

import { FitAddon } from "@xterm/addon-fit"
import { Terminal } from "@xterm/xterm"
import "./xterm.css"

import { debounce } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import { ElementRef, useEffect, useRef } from "react"
import { Socket } from "socket.io-client"

export default function EditorTerminal({
  socket,
  id,
  term,
  setTerm,
  visible,
}: {
  socket: Socket
  id: string
  term: Terminal | null
  setTerm: (term: Terminal) => void
  visible: boolean
}) {
  const terminalRef = useRef<ElementRef<"div">>(null)
  const fitAddonRef = useRef<FitAddon | null>(null)

  useEffect(() => {
    if (!terminalRef.current) return
    // console.log("new terminal", id, term ? "reusing" : "creating");

    const terminal = new Terminal({
      cursorBlink: true,
      theme: {
        foreground: "#2e3436",
        background: "#ffffff",
        black: "#2e3436",
        brightBlack: "#555753",
        red: "#cc0000",
        brightRed: "#ef2929",
        green: "#4e9a06",
        brightGreen: "#8ae234",
        yellow: "#c4a000",
        brightYellow: "#fce94f",
        blue: "#3465a4",
        brightBlue: "#729fcf",
        magenta: "#75507b",
        brightMagenta: "#ad7fa8",
        cyan: "#06989a",
        brightCyan: "#34e2e2",
        white: "#d3d7cf",
        brightWhite: "#eeeeec",
        cursor: "#2e3436",
        cursorAccent: "#ffffff",
        selection: "rgba(52, 101, 164, 0.3)",
      },
      fontFamily: "var(--font-geist-mono)",
      fontSize: 14,
      lineHeight: 1.5,
      letterSpacing: 0,
    })

    setTerm(terminal)
    const dispose = () => {
      terminal.dispose()
    }
    return dispose
  }, [])

  useEffect(() => {
    if (!term) return

    if (!terminalRef.current) return
    if (!fitAddonRef.current) {
      const fitAddon = new FitAddon()
      term.loadAddon(fitAddon)
      term.open(terminalRef.current)
      fitAddon.fit()
      fitAddonRef.current = fitAddon
    }

    const disposableOnData = term.onData((data) => {
      socket.emit("terminalData", id, data)
    })

    const disposableOnResize = term.onResize((dimensions) => {
      fitAddonRef.current?.fit()
      socket.emit("terminalResize", dimensions)
    })
    const resizeObserver = new ResizeObserver(
      debounce((entries) => {
        if (!fitAddonRef.current || !terminalRef.current) return

        const entry = entries[0]
        if (!entry) return

        const { width, height } = entry.contentRect

        // Only call fit if the size has actually changed
        if (
          width !== terminalRef.current.offsetWidth ||
          height !== terminalRef.current.offsetHeight
        ) {
          try {
            fitAddonRef.current.fit()
          } catch (err) {
            console.error("Error during fit:", err)
          }
        }
      }, 50) // Debounce for 50ms
    )

    // start observing for resize
    resizeObserver.observe(terminalRef.current)
    return () => {
      disposableOnData.dispose()
      disposableOnResize.dispose()
      resizeObserver.disconnect()
    }
  }, [term, terminalRef.current])

  useEffect(() => {
    if (!term) return
    const handleTerminalResponse = (response: { id: string; data: string }) => {
      if (response.id === id) {
        term.write(response.data)
      }
    }
    socket.on("terminalResponse", handleTerminalResponse)

    return () => {
      socket.off("terminalResponse", handleTerminalResponse)
    }
  }, [term, id, socket])

  return (
    <>
      <div
        ref={terminalRef}
        style={{ display: visible ? "block" : "none" }}
        className="w-full h-full text-left"
      >
        {term === null ? (
          <div className="flex items-center text-muted-foreground p-2">
            <Loader2 className="animate-spin mr-2 h-4 w-4" />
            <span>Connecting to terminal...</span>
          </div>
        ) : null}
      </div>
    </>
  )
}
