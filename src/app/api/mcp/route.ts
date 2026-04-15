import { NextRequest, NextResponse } from 'next/server'
import { TOOLS } from '@/lib/mcp/schema'
import { get_menu, place_order, check_order_status, cancel_order, list_my_orders, list_restaurants } from '@/lib/mcp/tools'

export const runtime = 'edge'

const ERROR_PARSE = -32700
const ERROR_INVALID_REQUEST = -32600
const ERROR_METHOD_NOT_FOUND = -32601
const ERROR_INVALID_PARAMS = -32602
const ERROR_SERVER = -32000

interface JsonRpcRequest {
  jsonrpc: string
  method: string
  params?: Record<string, unknown>
  id: string | number | null
}

function jsonRpcError(id: string | number | null, code: number, message: string) {
  return NextResponse.json(
    { jsonrpc: '2.0', error: { code, message }, id },
    { status: code === ERROR_PARSE ? 400 : 200 }
  )
}

function jsonRpcSuccess(id: string | number | null, result: unknown) {
  return NextResponse.json({ jsonrpc: '2.0', result, id })
}

export async function POST(request: NextRequest) {
  let body: JsonRpcRequest

  try {
    body = (await request.json()) as JsonRpcRequest
  } catch {
    return jsonRpcError(null, ERROR_PARSE, 'JSON 파싱 오류')
  }

  if (body.jsonrpc !== '2.0' || typeof body.method !== 'string' || body.id === undefined) {
    return jsonRpcError(body.id ?? null, ERROR_INVALID_REQUEST, '유효하지 않은 JSON-RPC 2.0 요청입니다.')
  }

  const { method, params, id } = body

  try {
    switch (method) {
      // MCP protocol: initialize handshake
      case 'initialize': {
        return jsonRpcSuccess(id, {
          protocolVersion: '2024-11-05',
          capabilities: {
            tools: {},
          },
          serverInfo: {
            name: 'mcp-food-platform',
            version: '1.0.0',
          },
        })
      }

      // MCP protocol: notifications (no response needed but return ok)
      case 'notifications/initialized': {
        return jsonRpcSuccess(id, {})
      }

      case 'tools/list': {
        return jsonRpcSuccess(id, { tools: TOOLS })
      }

      case 'tools/call': {
        if (!params || typeof params.name !== 'string' || !params.arguments) {
          return jsonRpcError(id, ERROR_INVALID_PARAMS, 'tools/call에는 name과 arguments가 필요합니다.')
        }

        const toolName = params.name
        const toolArgs = params.arguments as Record<string, unknown>

        switch (toolName) {
          case 'get_menu': {
            const result = await get_menu(toolArgs as unknown as Parameters<typeof get_menu>[0])
            return jsonRpcSuccess(id, {
              content: [{ type: 'text', text: JSON.stringify(result) }],
            })
          }

          case 'place_order': {
            const result = await place_order(toolArgs as unknown as Parameters<typeof place_order>[0])
            return jsonRpcSuccess(id, {
              content: [{ type: 'text', text: JSON.stringify(result) }],
            })
          }

          case 'check_order_status': {
            const result = await check_order_status(toolArgs as unknown as Parameters<typeof check_order_status>[0])
            return jsonRpcSuccess(id, {
              content: [{ type: 'text', text: JSON.stringify(result) }],
            })
          }

          case 'cancel_order': {
            const result = await cancel_order(toolArgs as unknown as Parameters<typeof cancel_order>[0])
            return jsonRpcSuccess(id, {
              content: [{ type: 'text', text: JSON.stringify(result) }],
            })
          }

          case 'list_my_orders': {
            const result = await list_my_orders(toolArgs as unknown as Parameters<typeof list_my_orders>[0])
            return jsonRpcSuccess(id, {
              content: [{ type: 'text', text: JSON.stringify(result) }],
            })
          }

          case 'list_restaurants': {
            const result = await list_restaurants(toolArgs as unknown as Parameters<typeof list_restaurants>[0])
            return jsonRpcSuccess(id, {
              content: [{ type: 'text', text: JSON.stringify(result) }],
            })
          }

          default:
            return jsonRpcError(id, ERROR_METHOD_NOT_FOUND, `알 수 없는 도구입니다: ${toolName}`)
        }
      }

      default: {
        return jsonRpcError(id, ERROR_METHOD_NOT_FOUND, `알 수 없는 메서드입니다: ${method}`)
      }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : '알 수 없는 서버 오류'
    return jsonRpcError(id, ERROR_SERVER, message)
  }
}

// MCP Streamable HTTP requires GET for SSE (server-sent events) — not needed for basic operation
// and DELETE for session cleanup — return 405 for both
export async function GET() {
  return new NextResponse('MCP Food Platform Server. Use POST for JSON-RPC.', { status: 200 })
}
