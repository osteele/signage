// @flow

import React, { Component } from 'react'

import ReactFireMixin from 'reactfire'
import TimerMixin from 'react-timer-mixin'
import { firebaseRef } from '../api/firebase'
import reactMixin from 'react-mixin'

type PlaylistFrameType = {| asset_id: string |}

export default class Signage extends Component {
  // added by mixins
  bindAsArray: (any, string) => void
  bindAsObject: (any, string) => void
  setInterval: (() => void, number) => void

  state = {
    assets: {},
    playlist: {},
    sequence: [],
    currentFrame: null,
    nextFrame: null,
  }

  nextIndex = 0
  endFrameTime = 0

  componentDidMount() {
    const { id } = this.props
    this.bindAsObject(firebaseRef.child('assets'), 'assets')
    this.bindAsObject(firebaseRef.child(`playlists/${id}`), 'playlist')
    this.bindAsArray(firebaseRef.child(`playlists/${id}/sequence`), 'sequence')
    this.setInterval(this.tick, 1000)
  }

  tick = () => {
    if (!Object.keys(this.state.assets).length || !this.state.sequence.length) return
    if (new Date().getTime() >= this.endFrameTime) {
      this.advanceFrame()
    }
  }

  advanceFrame() {
    const { playlist, sequence } = this.state
    const playlistIndex = this.nextIndex
    this.nextIndex = (1 + playlistIndex) % sequence.length

    const currentFrame = sequence[playlistIndex]
    const nextFrame = sequence[this.nextIndex]
    if (!currentFrame) return

    const duration = currentFrame.duration || playlist.duration || 60
    this.endFrameTime = new Date().getTime() + duration * 1000
    console.info(`waiting ${duration} seconds`)
    this.setState({ currentFrame, nextFrame })
  }

  renderAsset = (frame: PlaylistFrameType, prefetch: boolean = false) => {
    const asset = this.state.assets[frame.asset_id]
    const style = prefetch ? { 'display': 'none' } : {}
    return this.props.wireframe ? (
      <AssetPlaceholder asset={asset} frame={frame} style={style} />
    ) : asset ? (
      <iframe src={asset.url} className="embedded-asset" scrolling="no" frameBorder="0" style={style} />
    ) : (
      <div className="alert alert-danger">Missing asset: {frame.asset_id}</div>
    )
  }

  render() {
    const { currentFrame, nextFrame } = this.state

    if (!currentFrame) {
      return <div className="alert alert-info">Loading…</div>
    }

    return <div>
      {this.renderAsset(currentFrame)}
      {nextFrame && currentFrame !== nextFrame && this.renderAsset(nextFrame, true)}
    </div>
  }
}
reactMixin(Signage.prototype, ReactFireMixin)
reactMixin(Signage.prototype, TimerMixin)

// from http://stackoverflow.com/a/15710692/220667
const hashCode = (str) =>
  [].reduce.call(str, (p, c, i, a) => (p << 5) - p + a.charCodeAt(i), 0)

function AssetPlaceholder({ asset, frame, style }) {
  const h = hashCode(asset.url)
  const r0 = (h >> 16) & 0xff, g0 = (h >> 8) & 0xff, b0 = h & 0xff
  const r = 0x80 + Math.floor(r0 / 2), g = 0x80 + Math.floor(g0 / 2), b = 0x80 + Math.floor(b0 / 2)
  const background = `rgb(${r}, ${g}, ${b})`
  const style1 = {...style, ...{background}}
  return (
      <div className="embedded-asset alert" style={style1}>
      <h1>
        {asset.name}
        {frame.duration && <small> ({frame.duration} seconds)</small>}
      </h1>
      <div><tt>{asset.url}</tt></div>
    </div>
  )
}
