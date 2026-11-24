import type { NextFunction, Request, Response } from "express"
import type { PerfilUsuario } from "@prisma/client"
import { AppError } from "../../src/shared/AppError"

type DadosRequisicao = {
  body?: unknown
  params?: Record<string, string>
  query?: Record<string, unknown>
  cookies?: Record<string, string>
  user?: { id: string; perfil: PerfilUsuario }
}

export function fakeReq(dados: DadosRequisicao = {}): Request {
  return { body: {}, params: {}, query: {}, cookies: {}, ...dados } as unknown as Request
}

export function fakeRes() {
  const res = { status: jest.fn(), json: jest.fn(), send: jest.fn() }
  res.status.mockReturnValue(res)
  res.json.mockReturnValue(res)
  res.send.mockReturnValue(res)
  return res as typeof res & Response
}

export function fakeNext() {
  return jest.fn() as jest.Mock & NextFunction
}

export function esperarAppError(next: jest.Mock, status: number, code: string, message?: string) {
  expect(next).toHaveBeenCalledTimes(1)
  const erro = next.mock.calls[0][0]
  expect(erro).toBeInstanceOf(AppError)
  expect(erro).toMatchObject(message ? { status, code, message } : { status, code })
}
