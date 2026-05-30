import type { ReactNode } from 'react';

type KeyType = string | number

interface ConditionalRenderProps<P extends KeyType> {
  render: Partial<Record<P, ReactNode>>
  condition: P
}

interface ConditionalRenderBooleanProps {
  render: { false?: ReactNode, true?: ReactNode }
  condition: any
}

const ConditionalRender = <C extends KeyType>({ render, condition }: ConditionalRenderProps<C>) => {
  if (render[condition]) return <>{render[condition]}</>
  return null
}

const ConditionalRenderBoolean = ({ render, condition }: ConditionalRenderBooleanProps) => {
  return <>{Boolean(condition) ? render.true : render.false}</>
}

ConditionalRender.Boolean = ConditionalRenderBoolean

export { ConditionalRender }
